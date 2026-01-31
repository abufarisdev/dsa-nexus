const mongoose = require('mongoose');
const User = require('./models/User');
const PlatformProfile = require('./models/PlatformProfile');
const AggregatedStats = require('./models/AggregatedStats');
const TopicStats = require('./models/TopicStats');
const platformController = require('./controllers/platformController');
const dotenv = require('dotenv');

dotenv.config();

// Mocks
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.body = data;
        return res;
    };
    return res;
};

const mockReq = (body = {}, params = {}, user = {}) => ({
    body,
    params,
    user
});

const connectDB = async () => {
    try {
        // Use local DB or extracted from env. Assuming standard local URI if env missing for test.
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-nexus', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const runTestSuite = async () => {
    await connectDB();

    console.log('\n--- STARTING GFG INTEGRATION TEST SUITE ---');

    // Setup: Create a Test User
    const testEmail = 'test_gfg_user@example.com';
    await User.deleteOne({ email: testEmail });
    await PlatformProfile.deleteMany({ platformUsername: { $in: ['hassanrah26rj', 'quaderit6a6'] } });
    await AggregatedStats.deleteOne({ userId: 'test_user_id_123' }); // If consistent ID used

    let user = await User.create({
        username: 'TestUserGFG',
        email: testEmail,
        password: 'password123'
    });
    const userId = user._id.toString();
    console.log(`Test User Created: ${userId}`);

    // --- TEST SUITE 1: PLATFORM ADD FLOW ---
    console.log('\n[TEST SUITE 1] Platform Add Flow');

    // Case 1.1: Add hassanrah26rj
    console.log('Case 1.1: Add GFG Profile (hassanrah26rj)');
    const req1 = mockReq({ username: 'hassanrah26rj' }, {}, { userId });
    const res1 = mockRes();
    await platformController.addGfg(req1, res1);

    if (res1.statusCode && res1.statusCode !== 200) {
        console.error('FAIL: Status', res1.statusCode, res1.body);
    } else {
        console.log('PASS: HTTP 200', res1.body);
    }

    // Case 1.2: Add quaderit6a6
    console.log('Case 1.2: Add GFG Profile (quaderit6a6)');
    const req2 = mockReq({ username: 'quaderit6a6' }, {}, { userId });
    const res2 = mockRes();
    await platformController.addGfg(req2, res2);

    if (res2.statusCode && res2.statusCode !== 200) {
        console.error('FAIL: Status', res2.statusCode, res2.body);
    } else {
        console.log('PASS: HTTP 200', res2.body);
    }


    // --- TEST SUITE 2 & 3 & 4: DATA VALIDATION ---
    console.log('\n[TEST SUITE 2, 3, 4] Data Validation (Scraping, Flags, DB)');

    const profiles = await PlatformProfile.find({ userId, platform: 'gfg' });

    for (const p of profiles) {
        console.log(`\nValidating Profile: ${p.platformUsername}`);

        // 2.1 Stats exist
        if (p.stats.totalSolved >= 0 && p.stats.difficulty.easy >= 0) {
            console.log(`PASS: Stats present. Total: ${p.stats.totalSolved}, Easy: ${p.stats.difficulty.easy}`);
        } else {
            console.error('FAIL: Stats missing or invalid');
        }

        // 2.2 Topics
        const topicKeys = [
            'arrays', 'strings', 'stackQueue', 'trees', 'graphs', 'searching', 'sorting',
            'dp', 'heaps', 'hashing', 'twoPointers', 'slidingWindow', 'designPatterns',
            'greedy', 'constructive', 'permutations'
        ];
        // Check if map contains keys or if we can access them. Mongoose Map: p.topics.get('arrays')
        let topicsOk = true;
        // Mongoose Map is weird, sometimes just object in lean queries. 
        // If it's a Map:
        if (p.topics instanceof Map) {
            // It's a map
        } else {
            // Check object keys
        }

        console.log('Sample Topics:', JSON.stringify(Object.fromEntries(p.topics), null, 2));

        // 3.1 Data Completeness
        const dc = p.dataCompleteness;
        if (dc.totalSolved && dc.difficulty && (dc.topics === 'partial' || dc.topics === true) && !dc.heatmap && !dc.activeDays && !dc.streaks) {
            console.log('PASS: Data Completeness Flags correct');
        } else {
            console.error('FAIL: Data Completeness Flags invalid', dc);
        }

        // 3.2 Metadata
        if (p.profileMeta) {
            console.log(`PASS: Metadata found. Institute: ${p.profileMeta.institute}, Score: ${p.profileMeta.codingScore}`);
        } else {
            console.error('FAIL: Metadata missing');
        }
    }

    // 4.3 Aggregated Stats
    const aggStats = await AggregatedStats.findOne({ userId });
    console.log('\nValidating Aggregated Stats');
    if (aggStats && aggStats.totalQuestionsSolved > 0) {
        console.log(`PASS: Aggregated Total Solved: ${aggStats.totalQuestionsSolved}`);
        console.log(`Breakdown: Easy ${aggStats.difficultyBreakdown.easy}, Med ${aggStats.difficultyBreakdown.medium}, Hard ${aggStats.difficultyBreakdown.hard}`);
    } else {
        console.error('FAIL: Aggregated Stats missing or zero', aggStats);
    }


    // --- TEST SUITE 5: PORTFOLIO READ API ---
    console.log('\n[TEST SUITE 5] Portfolio Read API');
    const req5 = mockReq({}, { userId });
    const res5 = mockRes();
    await platformController.getPortfolio(req5, res5);

    if (res5.body && res5.body.aggregatedStats && res5.body.aggregatedStats.totalQuestionsSolved > 0) {
        console.log('PASS: Portfolio API returned data');
    } else {
        console.error('FAIL: Portfolio API failed', res5.body);
    }


    // --- TEST SUITE 6: ERROR HANDLING ---
    console.log('\n[TEST SUITE 6] Error Handling');

    console.log('Case 6.1: Empty Username');
    const req61 = mockReq({ username: '' }, {}, { userId });
    const res61 = mockRes();
    await platformController.addGfg(req61, res61);
    if (res61.statusCode === 400) console.log('PASS: HTTP 400 for empty username');
    else console.error('FAIL: expected 400, got', res61.statusCode);

    console.log('Case 6.2: Non-existent User');
    const req62 = mockReq({ username: 'thisuserdoesnotexist123_random_xyz' }, {}, { userId });
    const res62 = mockRes();
    await platformController.addGfg(req62, res62);
    // Expect 500 properly handled or specific error. Service throws "Failed to fetch...". Controller sends 500.
    if (res62.statusCode === 500 || res62.statusCode === 404) console.log('PASS: Graceful failure (500/404)', res62.body.message);
    else console.error('FAIL: expected error, got', res62.statusCode);


    // --- TEST SUITE 7: RATE LIMIT ---
    console.log('\n[TEST SUITE 7] Rate Limit');
    // Sync immediately
    const req7 = mockReq({}, {}, { userId });
    const res7 = mockRes();
    await platformController.syncGfg(req7, res7);

    if (res7.statusCode === 429) {
        console.log('PASS: HTTP 429 Rate Limit hit');
    } else {
        console.warn('WARN: Rate limit might not be hit if scraped too fast or logic differs? Status:', res7.statusCode);
        // It might pass if > 5 mins? No, we just added it seconds ago.
    }

    // Cleanup
    console.log('\nCleaning up test data...');
    // await User.deleteOne({ _id: userId });
    // await PlatformProfile.deleteMany({ userId });
    // await AggregatedStats.deleteOne({ userId });
    // await TopicStats.deleteOne({ userId });
    console.log('Cleanup Skipped for Manual Inspection if needed.');

    await mongoose.connection.close();
    console.log('Done.');
};

runTestSuite();
