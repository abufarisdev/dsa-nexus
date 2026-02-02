"use client"


import { Button } from "@/components/ui/button"
import { Copy, Share2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const activityData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  contributions: Math.floor(Math.random() * 50) + 10,
}))

function ProfileContent() {
  return (
    <div className="px-6 md:px-12 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Public Profile Preview</h1>
            <p className="text-muted-foreground">This is how recruiters will see your profile</p>
          </div>

          {/* Profile Card */}
          <div className="p-8 rounded-2xl border border-border/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl space-y-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between pb-6 border-b border-border/30">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h2 className="text-2xl font-bold">John Dev</h2>
                  <p className="text-muted-foreground">Full-Stack Developer • Problem Solver</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
                <Button size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-card/40">
                <p className="text-2xl font-bold">312</p>
                <p className="text-xs text-muted-foreground">Problems Solved</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card/40">
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-card/40">
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">Consistency</p>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Last 12 Weeks Activity</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: `1px solid var(--color-border)`,
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="contributions" fill="var(--color-primary)" radius={[4, 4, 0, 0]}>
                    {activityData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Badges */}
            <div className="space-y-3 pt-6 border-t border-border/30">
              <h3 className="font-semibold text-sm">Connected Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "LeetCode", stats: "312 problems" },
                  { name: "Codeforces", stats: "Pupil" },
                  { name: "AtCoder", stats: "100+ AC" },
                ].map((platform) => (
                  <div key={platform.name} className="px-3 py-2 rounded-lg bg-card/50 border border-border/50 text-xs">
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-muted-foreground text-xs">{platform.stats}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Link */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Share Your Profile</h2>
          <div className="p-4 rounded-xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl flex items-center justify-between">
            <code className="text-sm text-muted-foreground break-all">dsanexus.com/profile/john_dev</code>
            <Button variant="ghost" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}
