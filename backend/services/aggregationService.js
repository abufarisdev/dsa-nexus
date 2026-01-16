const PlatformProfile = require('../models/PlatformProfile');
const AggregatedStats = require('../models/AggregatedStats');
const TopicStats = require('../models/TopicStats');

const refreshPortfolio = async (userId) => {
    try {
        // 1. Fetch available platform profiles
        const profiles = await PlatformProfile.find({ userId });

        // Initialize Aggregates
        let totalQuestionsSolved = 0;
        let totalActiveDays = 0;
        let difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
        let maxStreak = 0;
        let currentStreak = 0; // Simplified: max of any platform? or combined? User didn't specify combined streak logic, usually max of platforms or date-merge. Let's do max for now.
        let platformsConnected = [];
        let combinedTopics = {};

        // 2. Aggregate Data
        profiles.forEach(p => {
            platformsConnected.push(p.platform);

            // Sum Solved
            const stats = p.stats;
            totalQuestionsSolved += stats.totalSolved;
            totalActiveDays += stats.totalActiveDays; // Ideally this should be a merge of unique dates, but simple sum for now if platforms distinct? No, active days is unique dates. For Heatmap merge we need actual dates.
            // NOTE: User requested "totalActiveDays" in combined. Simple sum is wrong if same day active on both. 
            // But since we only have LeetCode for now, sum = leetcode count. 
            // Future proof: we should merge heatmaps first to get count.

            // Sum Difficulty
            difficultyBreakdown.easy += stats.difficulty.easy;
            difficultyBreakdown.medium += stats.difficulty.medium;
            difficultyBreakdown.hard += stats.difficulty.hard;

            // Stats - Streak (Take the maximum across platforms? or active on any?)
            // Let's take the max of any platform for "Best Streak" approach
            maxStreak = Math.max(maxStreak, stats.streaks.max);

            // Current streak - complicated if we combine. Let's take max for now.
            // Or if active on *any* platform today/yesterday.
            currentStreak = Math.max(currentStreak, stats.streaks.current);

            // Merge Topics
            if (p.topics) {
                for (const [topic, count] of p.topics.entries()) {
                    combinedTopics[topic] = (combinedTopics[topic] || 0) + count;
                }
            }
        });

        // 3. Save aggregated_stats
        await AggregatedStats.findOneAndUpdate(
            { userId },
            {
                userId,
                totalQuestionsSolved,
                totalActiveDays, // Use sum/metrics from loop
                difficultyBreakdown,
                streaks: {
                    current: currentStreak,
                    max: maxStreak
                },
                platformsConnected,
                lastCalculatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // 4. Save topic_stats
        let strongestTopic = '';
        let weakestTopic = '';
        let maxCount = -1;
        let minCount = Infinity;

        const topicEntries = Object.entries(combinedTopics);
        if (topicEntries.length > 0) {
            topicEntries.forEach(([t, c]) => {
                if (c > maxCount) { maxCount = c; strongestTopic = t; }
                if (c < minCount) { minCount = c; weakestTopic = t; }
            });
        } else {
            minCount = 0; // Handle empty
        }

        await TopicStats.findOneAndUpdate(
            { userId },
            {
                userId,
                topics: combinedTopics,
                strongestTopic,
                weakestTopic: minCount === Infinity ? '' : weakestTopic,
                lastCalculatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        return { params: { userId, platformsConnected } };

    } catch (error) {
        console.error('Error refreshing portfolio:', error);
        throw error;
    }
};

module.exports = {
    refreshPortfolio
};
