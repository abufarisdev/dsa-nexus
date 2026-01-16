const axios = require('axios');

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

const fetchLeetCodeData = async (username) => {
  // Query 1: Basic Profile & Stats
  const profileQuery = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          aboutMe
          reputation
          ranking
          countryName
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        badges {
          displayName
          icon
          creationDate
        }
        submissionCalendar
      }
      recentSubmissionList(username: $username, limit: 20) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  // Query 2: Skill Tags (Topic Analysis)
  const skillQuery = `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
  `;

  try {
    // Execute queries in parallel for efficiency
    const [profileRes, skillRes] = await Promise.all([
      axios.post(LEETCODE_API_URL, { query: profileQuery, variables: { username } }),
      axios.post(LEETCODE_API_URL, { query: skillQuery, variables: { username } })
    ]);

    if (profileRes.data.errors) throw new Error(profileRes.data.errors[0].message);
    if (skillRes.data.errors) throw new Error(skillRes.data.errors[0].message);

    const data = profileRes.data.data.matchedUser;
    const skillData = skillRes.data.data.matchedUser;
    const recentSubmissions = profileRes.data.data.recentSubmissionList;

    if (!data) throw new Error('User not found');

    // Process Stats
    const stats = data.submitStats.acSubmissionNum;
    const totalSolved = stats.find(s => s.difficulty === 'All').count;
    const easySolved = stats.find(s => s.difficulty === 'Easy').count;
    const mediumSolved = stats.find(s => s.difficulty === 'Medium').count;
    const hardSolved = stats.find(s => s.difficulty === 'Hard').count;

    // Process Heatmap (Submission Calendar is a JSON string)
    const submissionCalendar = JSON.parse(data.submissionCalendar || '{}');
    const { totalActiveDays, maxStreak, currentStreak } = calculateStreaks(submissionCalendar);

    // Transform Heatmap to Array [{date, submissions}]
    const heatmapArray = Object.entries(submissionCalendar).map(([ts, count]) => ({
      date: new Date(Number(ts) * 1000).toISOString().split('T')[0],
      submissions: count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Flatten Topics with Normalization
    const topics = {};
    const categories = ['advanced', 'intermediate', 'fundamental'];
    if (skillData.tagProblemCounts) {
      categories.forEach(cat => {
        if (skillData.tagProblemCounts[cat]) {
          skillData.tagProblemCounts[cat].forEach(tag => {
            const normalizedTag = normalizeTopic(tag.tagName);
            topics[normalizedTag] = (topics[normalizedTag] || 0) + tag.problemsSolved;
          });
        }
      });
    }

    return {
      userId: '', // Set by controller
      platform: 'leetcode',
      platformUsername: data.username,
      platformProfileUrl: `https://leetcode.com/${data.username}`,

      stats: {
        totalSolved,
        difficulty: {
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved
        },
        totalActiveDays,
        submissionsCount: Object.values(submissionCalendar).reduce((a, b) => a + b, 0),
        streaks: {
          current: currentStreak,
          max: maxStreak
        }
      },

      topics,
      heatmap: heatmapArray,

      awards: data.badges.map(b => ({
        title: b.displayName,
        iconUrl: b.icon,
        earnedAt: b.creationDate
      })),

      lastSyncedAt: new Date()
    };

  } catch (error) {
    console.error('Error fetching LeetCode data:', error.message);
    throw error;
  }
};

const calculateStreaks = (calendar) => {
  const timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);

  if (timestamps.length === 0) {
    return { totalActiveDays: 0, maxStreak: 0, currentStreak: 0 };
  }

  let maxStreak = 0;
  let currentStreak = 0;
  let tempStreak = 1;
  const ONE_DAY = 24 * 60 * 60 * 1000; // milliseconds

  // Helper to get day string YYYY-MM-DD
  const getDay = (ts) => new Date(ts * 1000).toISOString().split('T')[0];

  // Calculate Max Streak
  for (let i = 1; i < timestamps.length; i++) {
    const prevDate = new Date(timestamps[i - 1] * 1000);
    const currDate = new Date(timestamps[i] * 1000);

    // Calculate difference in days by normalizing to midnight UTC
    const prevMidnight = new Date(Date.UTC(prevDate.getUTCFullYear(), prevDate.getUTCMonth(), prevDate.getUTCDate()));
    const currMidnight = new Date(Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), currDate.getUTCDate()));

    const diffDays = (currMidnight - prevMidnight) / ONE_DAY;

    if (diffDays === 1) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);

  // Calculate Current Streak
  const lastTimestamp = timestamps[timestamps.length - 1];
  const lastDateStr = new Date(lastTimestamp * 1000).toISOString().split('T')[0];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const yesterdayStr = new Date(now - ONE_DAY).toISOString().split('T')[0];

  if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
    currentStreak = 1;
    for (let i = timestamps.length - 2; i >= 0; i--) {
      const prevDate = new Date(timestamps[i] * 1000);
      const currDate = new Date(timestamps[i + 1] * 1000);

      const prevMidnight = new Date(Date.UTC(prevDate.getUTCFullYear(), prevDate.getUTCMonth(), prevDate.getUTCDate()));
      const currMidnight = new Date(Date.UTC(currDate.getUTCFullYear(), currDate.getUTCMonth(), currDate.getUTCDate()));

      if ((currMidnight - prevMidnight) / ONE_DAY === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    totalActiveDays: timestamps.length,
    maxStreak,
    currentStreak
  };
};

const normalizeTopic = (tag) => {
  const map = {
    'Array': 'arrays',
    'Hash Table': 'hashing',
    'String': 'strings',
    'Dynamic Programming': 'dp',
    'Math': 'math',
    'Sorting': 'sorting',
    'Greedy': 'greedy',
    'Depth-First Search': 'dfs',
    'Binary Search': 'binary-search',
    'Breadth-First Search': 'bfs',
    'Tree': 'trees',
    'Matrix': 'matrix',
    'Two Pointers': 'two-pointers',
    'Bit Manipulation': 'bit-manipulation',
    'Stack': 'stack',
    'Design': 'design',
    'Heap (Priority Queue)': 'heap',
    'Backtracking': 'backtracking',
    'Graph': 'graphs',
    'Simulation': 'simulation',
    'Prefix Sum': 'prefix-sum',
    'Sliding Window': 'sliding-window',
    'Union Find': 'union-find',
    'Linked List': 'linked-list',
    'Ordered Set': 'ordered-set',
    'Monotonic Stack': 'monotonic-stack',
    'Enumeration': 'enumeration',
    'Recursion': 'recursion',
    'Trie': 'trie',
    'Divide and Conquer': 'divide-and-conquer',
    'Bitmask': 'bitmask',
    'Queue': 'queue',
    'Binary Search Tree': 'bst',
    'Segment Tree': 'segment-tree',
    'Memoization': 'memoization',
    'Geometry': 'geometry',
    'Topological Sort': 'topological-sort',
    'Binary Indexed Tree': 'binary-indexed-tree',
    'Hash Function': 'hash-function',
    'Game Theory': 'game-theory',
    'Shortest Path': 'shortest-path',
    'Combinatorics': 'combinatorics',
    'Interactive': 'interactive',
    'String Matching': 'string-matching',
    'Data Stream': 'data-stream',
    'Rolling Hash': 'rolling-hash',
    'Brainteaser': 'brainteaser',
    'Randomized': 'randomized',
    'Monotonic Queue': 'monotonic-queue',
    'Merge Sort': 'merge-sort',
    'Iterator': 'iterator',
    'Concurrency': 'concurrency',
    'Doubly-Linked List': 'doubly-linked-list',
    'Probability and Statistics': 'probability',
    'Quickselect': 'quickselect',
    'Bucket Sort': 'bucket-sort',
    'Suffix Array': 'suffix-array',
    'Minimum Spanning Tree': 'mst',
    'Counting Sort': 'counting-sort',
    'Shell': 'shell',
    'Line Sweep': 'line-sweep',
    'Reservoir Sampling': 'reservoir-sampling',
    'Eulerian Circuit': 'eulerian-circuit',
    'Radix Sort': 'radix-sort',
    'Strongly Connected Component': 'scc',
    'Rejection Sampling': 'rejection-sampling',
    'Biconnected Component': 'biconnected-component'
  };
  return map[tag] || tag.toLowerCase().replace(/\s+/g, '-');
};

module.exports = {
  fetchLeetCodeData,
};
