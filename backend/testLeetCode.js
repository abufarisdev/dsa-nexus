const axios = require('axios'); // Make sure to run: npm install axios

async function testLeetCode() {
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: `
                query getUserProfile($username: String!) { 
                    matchedUser(username: $username) { 
                        username 
                        submitStats: submitStatsGlobal { 
                            acSubmissionNum { difficulty count } 
                        } 
                    } 
                }
            `,
            variables: { username: "u92Hdo7gtV" } // my leetcode test krne k liye bs
        });

        console.log(" Success! Data received:");
        console.log(JSON.stringify(response.data.data, null, 2));
    } catch (error) {
        console.error(" Error:", error.response ? error.response.data : error.message);
    }
}

testLeetCode();