"use client"

import { Trophy, Target, Zap, TrendingUp, Award, Star, CheckCircle, Sparkles } from "lucide-react"

const achievements = [
  { icon: Trophy, label: "First 100", unlocked: true },
  { icon: Target, label: "Perfect Week", unlocked: true },
  { icon: Zap, label: "Speedrunner", unlocked: true },
  { icon: CheckCircle, label: "All Easy", unlocked: true },
  { icon: TrendingUp, label: "500 Problems", unlocked: false },
  { icon: Award, label: "Algorithm Master", unlocked: false },
  { icon: Star, label: "Consistency Star", unlocked: false },
  { icon: Sparkles, label: "Code Wizard", unlocked: false },
]

export function Achievements() {
  return (
    <div className="p-4 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Achievements & Milestones</h3>
        <span className="text-xs text-slate-400">4/8 Unlocked</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 min-h-0">
        {achievements.map((achievement, idx) => {
          const Icon = achievement.icon
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border-blue-600/40 hover:border-blue-600/60"
                  : "bg-slate-900/50 border-slate-800/20 opacity-50"
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${achievement.unlocked ? "text-cyan-500" : "text-slate-400"}`} />
              <span className="text-xs font-medium text-center leading-tight">{achievement.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}