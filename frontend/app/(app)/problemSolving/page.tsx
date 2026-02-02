"use client"

import { useStats } from "@/hooks/useStats"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { PlatformBreakdown } from "@/components/platform-breakdown"
import { DifficultyDistribution } from "@/components/difficulty-distribution"
import { TopicAnalysis } from "@/components/topic-analysis"
import { StatsCard } from "@/components/stats-card"
import { Zap, Trophy, Target, Award } from "lucide-react"

export default function ProblemSolvingPage() {
    const { data, loading, error } = useStats()

    if (loading) return <div className="p-8 text-slate-400">Loading stats...</div>
    if (error) return <div className="p-8 text-red-400">Error: {error}</div>
    if (!data) return <div className="p-8 text-slate-400">No data available</div>

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Total Solved"
                    value={data.stats.totalSolved}
                    icon={<Trophy className="w-4 h-4 text-yellow-500" />}
                    change="+12 vs last week"
                />
                <StatsCard
                    label="Acceptance Rate"
                    value={`${data.stats.acceptanceRate?.toFixed(1) || 0}%`}
                    icon={<Target className="w-4 h-4 text-blue-500" />}
                    change="+2.1 vs last week"
                />
                <StatsCard
                    label="Current Streak"
                    value={data.platforms[0]?.streak || 0}
                    icon={<Zap className="w-4 h-4 text-orange-500" />}
                    change="+5 days"
                />
                <StatsCard
                    label="Global Rank"
                    value="Top 5%"
                    icon={<Award className="w-4 h-4 text-purple-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ActivityHeatmap data={data.heatmap} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DifficultyDistribution
                            easy={data.stats.easy}
                            medium={data.stats.medium}
                            hard={data.stats.hard}
                        />
                        <TopicAnalysis topics={data.topics} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <PlatformBreakdown platforms={data.platforms} />
                    {/* Add more widgets here if needed */}
                </div>
            </div>
        </div>
    )
}
