"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlatformBreakdownProps {
  platforms?: any[]; // Replace with strict type
  onManage?: () => void;
}

export function PlatformBreakdown({ platforms }: PlatformBreakdownProps) {
  // If no data passed, show empty or loading state (or fallback if allowed, but requirement says no hardcoded fallback)
  // For now, if array is empty, it just renders nothing.

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
        {platforms && platforms.map((platform) => (
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
        {(!platforms || platforms.length === 0) && (
          <div className="text-center text-slate-500 py-4 text-xs">No platforms connected.</div>
        )}
      </div>
    </div>
  )
}
