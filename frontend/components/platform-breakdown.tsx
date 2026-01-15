"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const platforms = [
  { name: "LeetCode", solved: 312, streak: 45, icon: "LC", color: "from-orange-500/20 to-orange-500/10" },
  { name: "Codeforces", solved: 156, streak: 28, icon: "CF", color: "from-blue-500/20 to-blue-500/10" },
  { name: "AtCoder", solved: 89, streak: 12, icon: "AT", color: "from-green-500/20 to-green-500/10" },
]

export function PlatformBreakdown() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">Connected Platforms</h3>
        <Button variant="outline" size="sm" className="gap-2 border-slate-800/50 bg-transparent">
          <Settings2 className="w-4 h-4" />
          Manage
        </Button>
      </div>
      <div className="grid gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className={`p-5 rounded-2xl border border-slate-800/30 bg-gradient-to-br ${platform.color} backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800/30 flex items-center justify-center font-bold text-sm">
                  {platform.icon}
                </div>
                <div>
                  <p className="font-semibold">{platform.name}</p>
                  <p className="text-xs text-slate-400">{platform.solved} problems solved</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{platform.streak}</p>
                <p className="text-xs text-slate-400">day streak</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
