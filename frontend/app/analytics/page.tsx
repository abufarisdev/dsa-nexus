"use client"

import DashboardLayout from "@/app/dashboard-layout"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
import { TrendingUp } from "lucide-react"

const difficultyData = [
  { difficulty: "Easy", count: 145, fill: "#10b981" },
  { difficulty: "Medium", count: 98, fill: "#3b82f6" },
  { difficulty: "Hard", count: 69, fill: "#ef4444" },
]

const trendData = [
  { week: "Week 1", weekly: 12, monthly: 12 },
  { week: "Week 2", weekly: 19, monthly: 15.5 },
  { week: "Week 3", weekly: 14, monthly: 15.2 },
  { week: "Week 4", weekly: 22, monthly: 16.8 },
  { week: "Week 5", weekly: 18, monthly: 17.2 },
  { week: "Week 6", weekly: 25, monthly: 18.5 },
  { week: "Week 7", weekly: 21, monthly: 19.1 },
  { week: "Week 8", weekly: 28, monthly: 20.3 },
]

const consistencyData = [
  { month: "Jan", avgProblems: 8, consistency: 65 },
  { month: "Feb", avgProblems: 12, consistency: 78 },
  { month: "Mar", avgProblems: 18, consistency: 82 },
  { month: "Apr", avgProblems: 15, consistency: 75 },
  { month: "May", avgProblems: 22, consistency: 88 },
  { month: "Jun", avgProblems: 25, consistency: 92 },
]

function AnalyticsContent() {
  return (
    <div className="px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-slate-400">Detailed insights into your DSA journey and problem-solving patterns</p>
        </div>

        {/* Insights Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Peak Performance</p>
              <p className="text-2xl font-bold">42 problems</p>
              <p className="text-xs text-slate-400">Best week was Feb 19 - Feb 26</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Average Weekly</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">19.3</p>
                <div className="text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">+12%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Consistency Score</p>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-xs text-slate-400">Excellent streak maintained</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Difficulty Distribution */}
          <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
            <h3 className="text-sm font-semibold mb-6">Problem Distribution by Difficulty</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="difficulty" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: `1px solid #475569`,
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly vs Monthly Trends */}
          <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
            <h3 className="text-sm font-semibold mb-6">Weekly vs Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: `1px solid #475569`,
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="weekly" stroke="#3b82f6" dot={{ fill: "#06b6d4", r: 4 }} name="Weekly" />
                <Line
                  type="monotone"
                  dataKey="monthly"
                  stroke="#a855f7"
                  dot={{ fill: "#a855f7", r: 4 }}
                  name="Monthly Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Over Time */}
        <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
          <h3 className="text-sm font-semibold mb-6">Consistency & Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consistencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: `1px solid #475569`,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgProblems"
                stroke="#3b82f6"
                dot={{ fill: "#06b6d4", r: 5 }}
                name="Avg Problems/Day"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="consistency"
                stroke="#a855f7"
                dot={{ fill: "#a855f7", r: 5 }}
                name="Consistency %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <AnalyticsContent />
    </DashboardLayout>
  )
}
