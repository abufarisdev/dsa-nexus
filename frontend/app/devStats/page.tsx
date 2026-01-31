"use client"

import { useStats } from "@/hooks/useStats"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { PlatformBreakdown } from "@/components/platform-breakdown"
import { StatsCard } from "@/components/stats-card"
import { GitCommit, GitPullRequest, AlertCircle, Star } from "lucide-react"

export default function DevStatsPage() {
    const { data, loading, error } = useStats()

    if (loading) return <div className="p-8 text-slate-400">Loading dev stats...</div>
    if (error) return <div className="p-8 text-red-400">Error: {error}</div>
    if (!data) return <div className="p-8 text-slate-400">No data available. Connect GitHub.</div>

    const dev = data.devStats || { totalCommits: 0, totalPRs: 0, totalIssues: 0, totalStarsGiven: 0, languages: {} };

    return (
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <h2 className="text-xl font-bold text-slate-200">Development Activity (GitHub)</h2>

            {/* Dev Specific Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Total Commits"
                    value={dev.totalCommits}
                    icon={<GitCommit className="w-4 h-4 text-emerald-500" />}
                />
                <StatsCard
                    label="Pull Requests"
                    value={dev.totalPRs}
                    icon={<GitPullRequest className="w-4 h-4 text-blue-500" />}
                />
                <StatsCard
                    label="Issues Opened"
                    value={dev.totalIssues}
                    icon={<AlertCircle className="w-4 h-4 text-orange-500" />}
                />
                <StatsCard
                    label="Stars Given"
                    value={dev.totalStarsGiven}
                    icon={<Star className="w-4 h-4 text-yellow-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Heatmap & Languages (Reuse heatmap) */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-semibold text-slate-400">Contribution Calendar</h3>
                    <ActivityHeatmap data={data.heatmap} />

                    {/* Language Breakdown (New Simple UI or reuse PlatformBreakdown logic?) 
              Let's use a simple listing since standard UI reuse is requested but different structure.
           */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <h3 className="text-sm font-semibold mb-4 text-slate-200">Languages Used</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(dev.languages || {}).map(([lang, bytes]) => (
                                <div key={lang} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                    <div className="text-sm font-medium text-slate-200">{lang}</div>
                                    <div className="text-xs text-slate-400">{(bytes as number).toLocaleString()} bytes</div>
                                </div>
                            ))}
                            {Object.keys(dev.languages || {}).length === 0 && <div className="text-slate-500 text-sm">No language data</div>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile/Platform Card */}
                <div className="space-y-6">
                    <PlatformBreakdown platforms={data.platforms} />
                </div>
            </div>
        </div>
    )
}
