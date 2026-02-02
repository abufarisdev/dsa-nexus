"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, AlertCircle, Loader2, Plus } from "lucide-react"
import { useState } from "react"

interface Platform {
  id: string
  name: string
  icon: string
  username: string
  status: "connected" | "syncing" | "error"
  lastSync: string
}

function PlatformsContent() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "leetcode",
      name: "LeetCode",
      icon: "💻",
      username: "dev_john",
      status: "connected",
      lastSync: "2 hours ago",
    },
    {
      id: "codeforces",
      name: "Codeforces",
      icon: "🔴",
      username: "john_dev",
      status: "connected",
      lastSync: "1 hour ago",
    },
    { id: "atcoder", name: "AtCoder", icon: "🎯", username: "johndev", status: "connected", lastSync: "3 hours ago" },
  ])

  const [newUsername, setNewUsername] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="w-5 h-5 text-green-500" />
      case "syncing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="px-6 md:px-12 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Connected Platforms</h1>
          <p className="text-muted-foreground">Manage your coding platform connections and sync data</p>
        </div>

        {/* Connected Platforms */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Connections</h2>
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="p-4 rounded-xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl flex items-center justify-between hover:border-border/60 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl">{platform.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">@{platform.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last synced</p>
                    <p className="text-sm font-medium">{platform.lastSync}</p>
                  </div>
                  <div className="flex-shrink-0">{getStatusIcon(platform.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Platform */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Connect New Platform</h2>
          <div className="p-6 rounded-xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { name: "GitHub", icon: "🐙", disabled: false },
                { name: "HackerRank", icon: "🏆", disabled: false },
                { name: "CodeChef", icon: "👨‍🍳", disabled: false },
              ].map((platform) => (
                <button
                  key={platform.name}
                  disabled={platform.disabled}
                  className="p-4 rounded-lg border border-border/30 bg-card/40 hover:border-primary/50 transition-colors disabled:opacity-50 cursor-disabled flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <span>{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>

            <div className="border-t border-border/30 pt-4">
              <p className="text-sm text-muted-foreground mb-3">Enter your username</p>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter platform username..."
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-input/50 border-border/50"
                />
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sync Settings</h2>
          <div className="p-6 rounded-xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/30">
              <div>
                <p className="font-medium">Auto-Sync Frequency</p>
                <p className="text-sm text-muted-foreground">Currently set to every 24 hours</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Last Full Sync</p>
                <p className="text-sm text-muted-foreground">March 5, 2024 at 2:15 PM</p>
              </div>
              <Button variant="outline" size="sm">
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlatformsPage() {
  return <PlatformsContent />
}
