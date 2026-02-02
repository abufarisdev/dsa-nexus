"use client"

import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { PlatformBadges } from "@/components/platform-badges"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { DifficultyDistribution } from "@/components/difficulty-distribution"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const platformBreakdownData = [
  { platform: "LeetCode", solved: 412, color: "var(--color-chart-1)" },
  { platform: "Codeforces", solved: 248, color: "var(--color-chart-2)" },
  { platform: "AtCoder", solved: 167, color: "var(--color-chart-3)" },
]

export default function DemoProfilePage() {
  const profileUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/profile/demo`

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <ProfileHeader
          name="Alice Chen"
          username="alice.chen"
          tagline="Competitive programmer and full-stack developer with a focus on system design"
          profileUrl={profileUrl}
        />

        <div className="px-6 md:px-12 space-y-12">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Stats Summary */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Stats Summary</h2>
              <ProfileStats
                stats={[
                  { label: "Total Solved", value: 827 },
                  { label: "Current Streak", value: 89 },
                  { label: "Longest Streak", value: 142 },
                  { label: "Days Active", value: 298 },
                ]}
              />
            </div>

            {/* Platform Breakdown */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold mb-6">Problems by Platform</h2>
                <div className="p-6 rounded-2xl border border-border/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="platform" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          border: `1px solid var(--color-border)`,
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="solved" radius={[8, 8, 0, 0]}>
                        {platformBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <PlatformBadges
                  platforms={[
                    {
                      name: "LeetCode",
                      icon: "🔗",
                      color: "from-orange-500/20 to-orange-500/10 border-orange-500/30 hover:border-orange-500/60",
                      url: "#",
                    },
                    {
                      name: "Codeforces",
                      icon: "🔗",
                      color: "from-blue-500/20 to-blue-500/10 border-blue-500/30 hover:border-blue-500/60",
                      url: "#",
                    },
                    {
                      name: "AtCoder",
                      icon: "🔗",
                      color: "from-green-500/20 to-green-500/10 border-green-500/30 hover:border-green-500/60",
                      url: "#",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ActivityHeatmap />
              <DifficultyDistribution />
            </div>

            {/* Last Synced */}
            <div className="p-6 rounded-2xl border border-border/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl text-center space-y-2">
              <p className="text-sm font-medium">Profile Status</p>
              <p className="text-xs text-muted-foreground">Last synced 45 minutes ago</p>
              <p className="text-xs text-muted-foreground text-pretty">
                Exceptional consistency and problem-solving dedication showcased across multiple platforms
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 px-6 md:px-12 py-12 border-t border-border/30 bg-background/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>DSA Nexus © 2026 • Built for developers who care about consistency</p>
        </div>
      </footer>
    </div>
  )
}
