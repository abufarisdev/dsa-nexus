import type React from "react"

interface StatsCardProps {
  label: string
  value: string | number
  change?: string
  icon?: React.ReactNode
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl hover:border-slate-700 transition-colors h-full min-h-[180px]">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{label}</h3>
        {icon && <div className="text-cyan-500">{icon}</div>}
      </div>
      <div className="space-y-2">
        <p className="text-3xl md:text-4xl font-bold">{value}</p>
        {change && <p className="text-xs text-slate-400">{change}</p>}
      </div>
    </div>
  )
}