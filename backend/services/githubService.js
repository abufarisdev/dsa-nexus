const axios = require('axios');
const crypto = require('crypto');

// Environment variables
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes hex string or similar
const ALGORITHM = 'aes-256-cbc';

// Encryption / Decryption Helpers
function encryptToken(token) {
    if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not defined');
    const iv = crypto.randomBytes(16);
    // Ensure key is a buffer, handling hex string input if necessary
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedData: encrypted,
        iv: iv.toString('hex')
    };
}

function decryptToken(encryptedData, ivHex) {
    if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not defined');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// OAuth: Exchange Code for Token
async function exchangeCodeForToken(code) {
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code
        }, {
            headers: {
                Accept: 'application/json'
            }
        });

        if (response.data.error) {
            throw new Error(`GitHub OAuth Error: ${response.data.error_description}`);
        }

        return response.data.access_token;
    } catch (error) {
        console.error('Error exchanging code for token:', error.message);
        throw error;
    }
}

// Fetch GitHub Stats
async function fetchGitHubStats(token) {
    try {
        // 1. Fetch User Profile & Repos (REST API)
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { login, html_url, public_repos, total_private_repos } = userRes.data;

        // 2. Fetch Aggregated Language Stats (REST API)
        // Note: This can be expensive for many repos. For MVP, we might limit to top 100 recent repos or just use GraphQL for this too if possible.
        // For now, let's try a simpler approach or fetch a few pages of repos.
        // A better way for languages is fetching user's repos and iterating, but rate limits apply. 
        // Optimization: We will skip detailed language stats for *every* repo if the user has hundreds.
        // Let's implement a "best effort" language stat for top repos.

        const reposRes = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated&type=owner', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const languageMap = {};
        reposRes.data.forEach(repo => {
            if (repo.language) {
                languageMap[repo.language] = (languageMap[repo.language] || 0) + 1; // Simple count for now, or we can fetch /languages for detailed byte count
            }
        });
        // Converting simple count to map for the schema (OR we could do byte count if we fetch per repo)
        // Schema expects "usage as byte count or percentage". Let's stick to simple repo count by language for efficiency first, 
        // or if we want bytes we need to call /languages on each repo which is n+1. 
        // Let's stick to repo count for this iteration to avoid rate limits, or maybe just `language` field is enough for "Top Languages".
        // Wait, the requirements said "Stored as aggregate usage (percentage or byte count)". 
        // Let's use the `languages` url from a few top repos to get some bytes, or just rely on the primary language of the repo.
        // Start with primary language count as a proxy for usage? 
        // "Languages used across all repositories" -> "Stored as aggregate usage". 
        // To be safer and more accurate without melting the API limit, let's just count the primary language of each repo.
        // If we really need bytes, we need GraphQL. Let's send a GraphQL query.

        // 3. GraphQL for Contributions & Detailed Stats
        const graphqlQuery = `
      query($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
          }
          starredRepositories {
            totalCount
          }
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              languages(first: 5) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

        const graphqlRes = await axios.post('https://api.github.com/graphql', {
            query: graphqlQuery,
            variables: { userName: login }
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (graphqlRes.data.errors) {
            throw new Error('GraphQL Error: ' + JSON.stringify(graphqlRes.data.errors));
        }

        const userData = graphqlRes.data.data.user;
        const contrib = userData.contributionsCollection;
        const calendar = contrib.contributionCalendar;

        // Process Heatmap
        const heatmap = [];
        let totalActiveDays = 0;
        calendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                if (day.contributionCount > 0) totalActiveDays++;
                heatmap.push({
                    date: day.date,
                    count: day.contributionCount
                });
            });
        });

        // Process Languages (Byte Count)
        const languageBytes = {};
        userData.repositories.nodes.forEach(repo => {
            repo.languages.edges.forEach(edge => {
                const langName = edge.node.name;
                const size = edge.size;
                languageBytes[langName] = (languageBytes[langName] || 0) + size;
            });
        });

        return {
            githubUsername: login,
            profileUrl: html_url,
            summary: {
                totalContributions: calendar.totalContributions,
                totalActiveDays: totalActiveDays,
                totalCommits: contrib.totalCommitContributions,
                totalPRs: contrib.totalPullRequestContributions,
                totalIssues: contrib.totalIssueContributions,
                totalStarsGiven: userData.starredRepositories.totalCount
            },
            heatmap,
            languages: languageBytes,
            repos: {
                totalPublic: public_repos,
                totalPrivate: total_private_repos || 0 // 'total_private_repos' requires scope, hopefully 'repo' scope gives it
            }
        };

    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        throw error;
    }
}

module.exports = {
    encryptToken,
    decryptToken,
    exchangeCodeForToken,
    fetchGitHubStats,
    revokeToken
};

// Revoke OAuth Token (Disconnect)
async function revokeToken(token) {
    try {
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        await axios.delete(`https://api.github.com/applications/${CLIENT_ID}/grant`, {
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: 'application/vnd.github+json'
            },
            data: { access_token: token }
        });
        return true;
    } catch (error) {
        console.warn('Revoke Token Warning:', error.response?.data || error.message);
        return false;
    }
}
