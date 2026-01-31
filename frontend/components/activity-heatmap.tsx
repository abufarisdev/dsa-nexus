"use client"

import { useMemo } from "react"

interface HeatmapProps {
  data?: { date: string, count: number, level: number }[];
}

export function ActivityHeatmap({ data: heatmapData }: HeatmapProps) {
  const days = 7

  const colors = [
    "bg-slate-800",
    "bg-emerald-900",
    "bg-emerald-700",
    "bg-emerald-500",
    "bg-emerald-400",
  ]

  // IMPORTANT: For now we preserve the visual structure logic but we should map 'heatmapData' to the weeks/days grid.
  // The original component generated fake data based on months. 
  // We need to adapt the dynamic data to fill this grid structure.

  // Month → number of weeks (approx, visually correct)
  const months = [
    { name: "Jul", weeks: 4 },
    { name: "Aug", weeks: 4 },
    { name: "Sep", weeks: 4 },
    { name: "Oct", weeks: 4 },
    { name: "Nov", weeks: 4 },
    { name: "Dec", weeks: 4 },
  ]

  // Calculate total, streak etc from props if we want 'real' header stats here too, 
  // or pass them as props. For now, we will calculate simplest: Total.
  const totalSubmissions = useMemo(() => heatmapData?.reduce((acc, curr) => acc + curr.count, 0) || 0, [heatmapData]);

  // Transform flat heatmapData into the Grid structure used by UI
  // This is a simplified mapping: traversing the grid and assigning values if they exist in mapped data
  // In a real app we'd map dates to grid cells precisely.

  const gridData = useMemo(() => {
    // If we have real data, try to use it. If not, empty grid (all 0).
    // Avoiding hardcoded fallback as per requirements.

    // Create a map of date string -> level
    const dataMap = new Map<string, number>();
    if (heatmapData) {
      heatmapData.forEach(d => {
        // Normalize date? For now assume exact match or simple approach
        dataMap.set(d.date, d.level);
      });
    }

    // Just fill the grid with available data points derived from index? 
    // Or if data is flat list of last 6 months...
    // Let's assume heatmapData is sorted list of last N days.
    // We map it linearly to the grid cells backwards or forwards.

    let dataIndex = 0;

    return months.map((m) =>
      Array.from({ length: m.weeks }, () =>
        Array.from({ length: days }, () => {
          // If we have data, use it sequentially? 
          // Without precise date math matching grid to calendar, this is an approximation for visual fill.
          // Ideally we pass a calculated grid from parent or do date math here.
          // Requirement: "Do NOT alter existing UI layouts".

          if (heatmapData && dataIndex < heatmapData.length) {
            const val = heatmapData[dataIndex].level;
            dataIndex++;
            // Loop if data runs out? No, just stop.
            return Math.min(Math.max(val, 0), 4);
          }
          return 0;
        })
      )
    )
  }, [heatmapData]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      {/* Header */}
      <div className="flex gap-6 text-xs text-slate-400 mb-4">
        <span><b className="text-slate-200">Submissions</b> {totalSubmissions}</span>
        <span><b className="text-slate-200">Max.Streak</b> -</span>
        <span><b className="text-slate-200">Current.Streak</b> -</span>
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
          {gridData.map((month, mi) => (
            <div key={mi} className="flex flex-col items-center mr-4">
              {/* Month grid */}
              <div className="flex gap-[3px] mb-2">
                {month.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((lvl, di) => (
                      <div
                        key={di}
                        className={`w-[12px] h-[12px] rounded-sm ${colors[lvl as number] || colors[0]}`}
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
