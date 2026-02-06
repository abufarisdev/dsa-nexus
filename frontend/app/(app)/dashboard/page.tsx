"use client"

import { ActivityHeatmap } from "@/components/activity-heatmap"
import { TrendingUp, Flame, Zap, Target, BarChart3, Award, Brain, Calendar, Trophy, ChevronRight, PlayCircle, Target as TargetIcon, Share2, PieChart, LineChart } from "lucide-react"
import { DifficultyDistribution } from "@/components/difficulty-distribution"
import { motion } from "framer-motion"

const mockTopics = [
  { name: "Arrays & Hashing", solved: 45, total: 150, percentage: 30 },
  { name: "Two Pointers", solved: 28, total: 90, percentage: 31 },
  { name: "Sliding Window", solved: 15, total: 65, percentage: 23 },
  { name: "Stack", solved: 32, total: 80, percentage: 40 },
  { name: "Binary Search", solved: 18, total: 110, percentage: 16 },
]

function DashboardContent() {
  return (
    <div className="px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Analytics Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1.5">Track your DSA progress across all platforms</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Live Sync</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Solved", value: "312", change: "+12 this week", icon: Target, color: "from-blue-500 to-cyan-500" },
            { label: "Active Days", value: "45", change: "days consistent", icon: Flame, color: "from-orange-500 to-red-500" },
            { label: "Daily Streak", value: "7", change: "current streak", icon: Zap, color: "from-purple-500 to-pink-500" },
            { label: "Accuracy", value: "78%", change: "+2% this week", icon: BarChart3, color: "from-green-500 to-emerald-500" },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-bold text-gray-100">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1.5">{stat.label}</div>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}/20 border ${stat.color.replace('to', 'border').replace('from', 'border')}/30`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">{stat.change}</div>
            </div>
          ))}
        </motion.div>

        {/* Spacer */}
        <div className="h-1" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* Left Column - Heatmap */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Activity Heatmap
                </h3>
                <span className="text-xs text-gray-400 px-2 py-1 rounded bg-gray-800/50">90 days</span>
              </div>
              <div className="h-44">
                <ActivityHeatmap />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Difficulty Distribution */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Difficulty Distribution
                </h3>
                <PieChart className="w-4 h-4 text-purple-400" />
              </div>
              <div className="h-40 flex items-center justify-center">
                <DifficultyDistribution />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-1" />

        {/* Second Row - Achievements and Topic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Achievements */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  Achievements
                </h3>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {[
                  { title: "Week Warrior", desc: "7 days streak", icon: Award, color: "text-yellow-500" },
                  { title: "Speed Demon", desc: "<30min solves", icon: Zap, color: "text-blue-500" },
                  { title: "Consistency", desc: "30-day streak", icon: TrendingUp, color: "text-green-500" },
                  { title: "Topic Master", desc: "5 topics mastered", icon: Brain, color: "text-purple-500" },
                ].map((achievement, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                    <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate">{achievement.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{achievement.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Topic Analysis */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Topic Analysis
                </h3>
                <span className="text-sm text-gray-400">Progress by category</span>
              </div>
              <div className="space-y-4">
                {mockTopics.map((topic, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300 truncate pr-4">{topic.name}</span>
                      <span className="text-sm text-gray-400 flex-shrink-0">{topic.solved}/{topic.total} ({topic.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.percentage}%` }}
                        transition={{ delay: idx * 0.05 }}
                        className={`h-full ${
                          topic.percentage >= 40 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          topic.percentage >= 25 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-1" />

        {/* Third Row - Platform Breakdown and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Platform Breakdown */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4 h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  Platform Breakdown
                </h3>
                <LineChart className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-4">
                {[
                  { platform: "LeetCode", count: 158, color: "from-orange-500 to-red-500", percentage: 51 },
                  { platform: "Codeforces", count: 89, color: "from-blue-500 to-purple-500", percentage: 29 },
                  { platform: "HackerRank", count: 42, color: "from-green-500 to-emerald-500", percentage: 13 },
                  { platform: "AtCoder", count: 23, color: "from-cyan-500 to-blue-500", percentage: 7 },
                ].map((platform, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300 truncate pr-4">{platform.platform}</span>
                      <span className="text-sm text-gray-400 flex-shrink-0">{platform.count}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${platform.color}`}
                        style={{ width: `${platform.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Today's Goal",
                  desc: "Solve 3 problems",
                  progress: 66,
                  color: "from-blue-500 to-cyan-500",
                  icon: TargetIcon,
                  action: "Continue"
                },
                {
                  title: "Weak Topics",
                  desc: "Binary Search, DP",
                  progress: 40,
                  color: "from-orange-500 to-red-500",
                  icon: Brain,
                  action: "Practice"
                },
                {
                  title: "Share Progress",
                  desc: "Update portfolio",
                  progress: 85,
                  color: "from-purple-500 to-pink-500",
                  icon: Share2,
                  action: "Share"
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <card.icon className="w-4 h-4" />
                        <h4 className="text-base font-semibold text-gray-200">{card.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400">{card.desc}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{card.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`h-full bg-gradient-to-r ${card.color}`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <button className="w-full text-sm py-2 px-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-gray-300 flex items-center justify-center gap-2">
                    {card.action}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-0.5" />

        {/* Recent Activity - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Activity
            </h3>
            <span className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">View all</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { platform: "LeetCode", problem: "Two Sum", difficulty: "Easy", time: "2h ago" },
              { platform: "Codeforces", problem: "A. Watermelon", difficulty: "Easy", time: "1d ago" },
              { platform: "HackerRank", problem: "Array Manipulation", difficulty: "Medium", time: "2d ago" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                  activity.platform === "LeetCode" ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400" :
                  activity.platform === "Codeforces" ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400" :
                  "bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-400"
                }`}>
                  {activity.platform.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{activity.problem}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      activity.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : 
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {activity.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
                <PlayCircle className="w-4 h-4 text-gray-500 hover:text-blue-400 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

import ProfilePanel from "@/components/profile-panel"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Profile Panel - Desktop Only */}
      <aside className="hidden lg:block shrink-0 border-r border-gray-800/50">
        <ProfilePanel />
      </aside>

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-auto">
        <DashboardContent />
      </div>
    </div>
  )
}