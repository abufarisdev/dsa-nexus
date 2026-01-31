import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { api, FullStats, PlatformStat, ActivityDay } from "@/lib/api";

export function useStats() {
    const pathname = usePathname();
    const [data, setData] = useState<FullStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to normalize backend data to UI format
    const normalizeData = (source: string, rawData: any): FullStats => {
        // Defaults
        const defaults: FullStats = {
            userId: "",
            stats: { totalSolved: 0, easy: 0, medium: 0, hard: 0 },
            platforms: [],
            heatmap: []
        };

        if (!rawData) return defaults;

        if (source === "github") {
            // Normalize GitHub
            // Backend returns: { summary: { totalContributions, ... }, heatmap: [{ date, count }], ... }
            return {
                userId: rawData.userId,
                stats: {
                    totalSolved: rawData.summary?.totalContributions || 0, // Mapping contributions to main stat
                    easy: rawData.summary?.totalCommits || 0,
                    medium: rawData.summary?.totalPRs || 0,
                    hard: rawData.summary?.totalIssues || 0,
                    acceptanceRate: 100 // Placeholder
                },
                platforms: [{
                    name: "GitHub",
                    solved: rawData.summary?.totalContributions || 0,
                    streak: rawData.summary?.totalActiveDays || 0,
                    icon: "GH",
                    color: "from-slate-600/20 to-slate-600/10",
                    verified: true,
                    url: rawData.profileUrl
                }],
                heatmap: rawData.heatmap?.map((d: any) => ({
                    date: d.date,
                    count: d.count,
                    level: d.count === 0 ? 0 : d.count < 3 ? 1 : d.count < 6 ? 2 : d.count < 9 ? 3 : 4
                })) || [],
                devStats: {
                    ...rawData.summary,
                    languages: rawData.languages || {}
                }
            };
        }

        if (source === "leetcode" || source === "combined" || source === "codeforces") {
            // Normalize Portfolio/LeetCode/Codeforces
            // Backend `getPortfolio` returns: { aggregatedStats: { totalSolved, easy, ... }, user: ... }
            // Backend `getLeetCodeProfile` and others returns: { stats: { totalSolved, easy, ... }, ... }

            const statsObj = rawData.aggregatedStats || rawData.stats || {};

            return {
                userId: rawData.userId ||
                    (rawData.user && rawData.user.userId) || "",
                stats: {
                    totalSolved: statsObj.totalSolved || 0,
                    easy: statsObj.easy || 0,
                    medium: statsObj.medium || 0,
                    hard: statsObj.hard || 0,
                    acceptanceRate: statsObj.acceptanceRate || 0
                },
                platforms: [
                    {
                        name: "LeetCode",
                        solved: rawData.platform === 'leetcode' ? statsObj.totalSolved : (rawData.aggregatedStats?.totalSolved || 0), // Simplification
                        streak: rawData.heatmap ? Object.keys(rawData.heatmap).length : 0, // Approx streak from heatmap keys count if real streak not in top level
                        icon: "LC",
                        color: "from-orange-500/20 to-orange-500/10",
                        verified: true,
                        url: rawData.platformProfileUrl || "https://leetcode.com"
                    },
                    // Add CF/Others if combined
                ],
                // Normalize Heatmap: Backend LC heatmap is { timestamp/date: count } or similar
                heatmap: [], // TODO: Implement specific heatmap normalization for LC object
                // Normalize Topics
                topics: rawData.topicStats ? rawData.topicStats.map((t: any) => ({
                    name: t.topicName,
                    solved: t.solved,
                    total: t.totalQuestions || 100, // Fallback if total not provided by backend?
                    percentage: Math.round((t.solved / (t.totalQuestions || 100)) * 100)
                })) : []
            };
        }

        return defaults;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let result = null;
                let source = "";

                if (pathname.includes("/devStats")) {
                    source = "github";
                    result = await api.getGitHubStats();
                } else if (pathname.includes("/problemSolving/leetcode")) {
                    source = "leetcode";
                    result = await api.getLeetCodeStats();
                } else if (pathname.includes("/problemSolving/codeforces")) {
                    source = "codeforces";
                    result = await api.getCodeforcesStats();
                } else {
                    // Default Combined Problem Solving
                    source = "combined";
                    result = await api.getCombinedStats();
                }

                setData(result ? normalizeData(source, result) : null);
            } catch (err: any) {
                setError(err.message);
                console.error("Fetch stats error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pathname]);

    return { data, loading, error };
}
