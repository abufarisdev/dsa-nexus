const axios = require('axios');
const cheerio = require('cheerio');

const fetchGFGProfile = async (username) => {
    try {
        const url = `https://auth.geeksforgeeks.org/user/${username}/`;
        const response = await axios.get(url, {
            headers: {
                // Mimic real browser to avoid 403 or basic blocks
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // 1. Initialize Profile Object
        const profile = {
            platform: 'gfg',
            platformUsername: username,
            platformProfileUrl: url,
            stats: {
                totalSolved: 0,
                difficulty: { school: 0, basic: 0, easy: 0, medium: 0, hard: 0 },
                totalActiveDays: 0,
                submissionsCount: 0,
                streaks: { current: 0, max: 0 }
            },
            topics: {},
            profileMeta: {
                institute: '',
                codingScore: '0',
                rank: '0'
            },
            dataCompleteness: {
                totalSolved: true,
                difficulty: true,
                topics: 'partial', // Explicitly mark as partial per requirement
                heatmap: false,
                activeDays: false,
                streaks: false
            },
            heatmap: [],
            awards: []
        };

        // 2. Extract Data from Next.js Hydration Script
        // This is the most reliable way to get totalSolved
        $('script').each((i, el) => {
            const content = $(el).html();
            if (content && content.includes('self.__next_f.push')) {
                // Try to find meta fields in the script dump
                if (content.includes('institute_name')) {
                    const instMatch = content.match(/"institute_name":"([^"]+)"/);
                    if (instMatch) profile.profileMeta.institute = instMatch[1];
                }
                if (content.includes('score')) {
                    // "score":123
                    const scoreMatch = content.match(/"score":(\d+)/);
                    if (scoreMatch) profile.profileMeta.codingScore = scoreMatch[1];
                }
                if (content.includes('rank')) {
                    const rankMatch = content.match(/"rank":(\d+)/);
                    if (rankMatch) profile.profileMeta.rank = rankMatch[1];
                }

                if (content.includes('total_problems_solved')) {
                    try {
                        const solvedMatch = content.match(/"total_problems_solved":(\d+)/);
                        if (solvedMatch) {
                            profile.stats.totalSolved = parseInt(solvedMatch[1], 10);
                        }
                    } catch (e) {
                        console.warn('Error parsing script content for GFG:', e);
                    }
                }
            }
        });

        // 3. Fallback / Detail Extraction from HTML (Text Scraping)
        // Ensure totalSolved is set if missing from hydrator
        if (profile.stats.totalSolved === 0) {
            const totalText = $('body').text().match(/Problems Solved[:\s]+(\d+)/i);
            if (totalText) {
                profile.stats.totalSolved = parseInt(totalText[1], 10);
            }
        }

        // Fallback for Meta if script didn't catch it
        if (!profile.profileMeta.institute) {
            // Look for specific classes or text labels if known. 
            // Common GFG layout: "Institute: X"
            const instText = $('body').text().match(/Institute[:\s]+([^\n]+)/i);
            if (instText) profile.profileMeta.institute = instText[1].trim();
        }
        if (profile.profileMeta.codingScore === '0') {
            const scoreMatch = $('body').text().match(/Coding Score[:\s]+(\d+)/i);
            if (scoreMatch) profile.profileMeta.codingScore = scoreMatch[1];
        }

        // Difficulty Breakdown

        // Difficulty Breakdown
        const difficulties = ['School', 'Basic', 'Easy', 'Medium', 'Hard'];
        difficulties.forEach(diff => {
            const regex = new RegExp(`${diff}\\s*\\(?\\s*(\\d+)\\s*\\)?`, 'i');
            $(`*:contains("${diff}")`).each((i, el) => {
                // Ensure we are looking at the label itself, not a parent container
                if ($(el).children().length < 2) {
                    const text = $(el).text().trim();
                    const match = text.match(regex);
                    if (match) {
                        profile.stats.difficulty[diff.toLowerCase()] = parseInt(match[1], 10);
                    }
                }
            });
        });

        // 4. Topic Tags
        // Initialize fetchTopics with 0 to ensure schema compliance for required keys
        // "Ensure that the following topic keys exist (even if value = 0)"
        const fetchedTopics = {
            arrays: 0, strings: 0, stackQueue: 0, trees: 0, graphs: 0, searching: 0, sorting: 0,
            dp: 0, heaps: 0, hashing: 0,
            twoPointers: 0, slidingWindow: 0, designPatterns: 0,
            greedy: 0, constructive: 0, permutations: 0,
            // Extras
            backtracking: 0, bitManipulation: 0
        };

        // Topic Normalization Mapping
        const TOPIC_MAPPING = {
            // Standard
            'Arrays': 'arrays', 'String': 'strings', 'Strings': 'strings',
            'Stack': 'stackQueue', 'Queue': 'stackQueue',
            'Tree': 'trees', 'Trees': 'trees',
            'Graph': 'graphs', 'Graphs': 'graphs',
            'Searching': 'searching', 'Sorting': 'sorting',
            'Dynamic Programming': 'dp',
            'Heap': 'heaps', 'Heaps': 'heaps',
            'Hashing': 'hashing', 'Hash': 'hashing', 'Map': 'hashing',
            // Extended
            'Two Pointer': 'twoPointers', 'Two Pointers': 'twoPointers',
            'Sliding Window': 'slidingWindow',
            'Design Pattern': 'designPatterns', 'Design Patterns': 'designPatterns',
            'Greedy': 'greedy', 'Greedy Algorithm': 'greedy', 'Greedy Algorithms': 'greedy',
            'Constructive': 'constructive', 'Constructive Algorithms': 'constructive',
            'Permutation': 'permutations', 'Permutations': 'permutations',
            'Backtracking': 'backtracking',
            'Bit Manipulation': 'bitManipulation'
        };

        // Attempt scraping, falling back to 0s if missing
        $('a[href*="/problem-tags/"]').each((i, el) => {
            const textWithCount = $(el).text().trim(); // e.g. "Arrays (5)"
            const countMatch = textWithCount.match(/(.+?)\s*\((\d+)\)/);
            if (countMatch) {
                const rawTag = countMatch[1].trim();
                const count = parseInt(countMatch[2], 10);

                // Normalize
                const mappedKey = TOPIC_MAPPING[rawTag] || TOPIC_MAPPING[rawTag.replace(/s$/, '')];

                if (mappedKey) {
                    fetchedTopics[mappedKey] = (fetchedTopics[mappedKey] || 0) + count;
                }
            }
        });

        profile.topics = fetchedTopics;

        return profile;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('GFG Profile not found');
        }
        console.error('GFG Scraping Error:', error.message);
        throw new Error('Failed to fetch GFG profile');
    }
};

module.exports = { fetchGFGProfile };
