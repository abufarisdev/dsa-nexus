"use client"

import DashboardLayout from "@/app/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { PlatformBreakdown } from "@/components/platform-breakdown"
import { Achievements } from "@/components/achievements"
import { TopicAnalysis } from "@/components/topic-analysis"
import { TrendingUp, Flame, Link2 } from "lucide-react"
import { DifficultyDistribution } from "@/components/difficulty-distribution"




function DashboardContent() {
  return (
    <div className="px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Developer Analytics</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Live Activity</span>
            </div>
          </div>
          <p className="text-slate-400">Unified DSA performance tracking</p>
        </div>

        {/* ROW 1: Total Solved, Active Days, Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Total Solved */}
          <div className="lg:col-span-3 h-full">
            <StatsCard
              label="Total Problems Solved"
              value={312}
              change="+12 this week"
              icon={<TrendingUp className="w-5 h-5" />}
            />
          </div>

          {/* Active Days */}
          <div className="lg:col-span-3 h-full">
            <StatsCard
              label="Active Days"
              value={45}
              change="days consistent"
              icon={<Flame className="w-5 h-5" />}
            />
          </div>

          {/* Heatmap - Match height */}
          <div className="lg:col-span-6 h-full">
            <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl h-full flex flex-col">
              <h3 className="text-sm font-semibold mb-4">Activity Heatmap</h3>
              <div className="flex-1 overflow-hidden">
                <ActivityHeatmap />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Achievements and Problem Solved Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Achievements */}
          <div className="lg:col-span-8">
            <Achievements />
          </div>
          {/* Problem Solved Distribution */}
          <div className="lg:col-span-4">
            <DifficultyDistribution />
          </div>

          {/* ROW 3: DSA Topic Analysis (full width) */} <div className="lg:col-span-12"> <TopicAnalysis /> </div>


        </div>
      </div>
    </div>

  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}