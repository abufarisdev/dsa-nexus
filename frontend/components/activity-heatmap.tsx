"use client"

import { useMemo } from "react"

export function ActivityHeatmap() {
  const days = 7

  const colors = [
    "bg-slate-800",
    "bg-emerald-900",
    "bg-emerald-700",
    "bg-emerald-500",
    "bg-emerald-400",
  ]

  // Month → number of weeks (approx, visually correct)
  const months = [
    { name: "Jul", weeks: 4 },
    { name: "Aug", weeks: 4 },
    { name: "Sep", weeks: 4 },
    { name: "Oct", weeks: 4 },
    { name: "Nov", weeks: 4 },
    { name: "Dec", weeks: 4 },
  ]

  // deterministic fake data
  const data = useMemo(() => {
    return months.map((m, mi) =>
      Array.from({ length: m.weeks }, (_, w) =>
        Array.from({ length: days }, (_, d) => {
          const seed = (mi * 31 + w * 11 + d * 7) % 10
          if (seed < 5) return 0
          if (seed < 7) return 1
          if (seed < 8) return 2
          if (seed < 9) return 3
          return 4
        })
      )
    )
  }, [])

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      {/* Header */}
      <div className="flex gap-6 text-xs text-slate-400 mb-4">
        <span><b className="text-slate-200">Submissions</b> 210</span>
        <span><b className="text-slate-200">Max.Streak</b> 12</span>
        <span><b className="text-slate-200">Current.Streak</b> 0</span>
      </div>

      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-3 text-[10px] text-slate-400">
          <span></span>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>

        {/* Heatmap */}
        <div className="flex">
          {data.map((month, mi) => (
            <div key={mi} className="flex flex-col items-center mr-4">
              {/* Month grid */}
              <div className="flex gap-[3px] mb-2">
                {month.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((lvl, di) => (
                      <div
                        key={di}
                        className={`w-[12px] h-[12px] rounded-sm ${colors[lvl]}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Month label BELOW */}
              <span className="text-xs text-slate-400">{months[mi].name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
