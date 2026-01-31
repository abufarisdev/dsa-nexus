"use client"

import React, { useMemo } from "react"

export interface DifficultyDistributionProps {
  easy?: number;
  medium?: number;
  hard?: number;
}

export function DifficultyDistribution({ easy = 0, medium = 0, hard = 0 }: DifficultyDistributionProps) {

  const difficultyData = useMemo(() => [
    { name: "Easy", value: easy, color: "#10b981" },   // green
    { name: "Medium", value: medium, color: "#f59e0b" }, // yellow
    { name: "Hard", value: hard, color: "#ef4444" },   // red
  ], [easy, medium, hard]);

  const total = useMemo(() => difficultyData.reduce((s, d) => s + d.value, 0), [difficultyData])
  const radius = 52
  const stroke = 14
  const circumference = 2 * Math.PI * radius

  // produce cumulative offsets so arcs stack correctly
  const segments = useMemo(() => {
    let cumulative = 0
    return difficultyData.map((d) => {
      // Avoid division by zero
      const length = total > 0 ? (d.value / total) * circumference : 0;
      const offset = cumulative
      cumulative += length
      return {
        ...d,
        length,
        offset,
      }
    })
  }, [total, difficultyData, circumference])

  return (
    <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
      <h3 className="text-sm font-semibold mb-6">DSA</h3>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative w-[160px] h-[160px] flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <g transform="translate(80,80) rotate(-90)">
              {/* base ring */}
              <circle
                r={radius}
                cx="0"
                cy="0"
                stroke="#0f1724" /* very dark */
                strokeWidth={stroke}
                fill="transparent"
              />

              {/* segments drawn as stroked circles with dasharray/dashoffset */}
              {segments.map((seg, idx) => (
                <circle
                  key={seg.name}
                  r={radius}
                  cx="0"
                  cy="0"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${seg.length} ${circumference}`}
                  strokeDashoffset={-seg.offset}
                  style={{ transition: "stroke-dashoffset 600ms, stroke-dasharray 600ms" }}
                />
              ))}
            </g>
          </svg>

          {/* Center white number */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <div className="text-3xl md:text-4xl font-extrabold leading-none text-white">{total}</div>
          </div>
        </div>

        {/* Right side legend / counts in stacked rounded rectangles */}
        <div className="flex-1">
          <div className="space-y-3">
            {difficultyData.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between bg-slate-800/60 border border-slate-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-sm text-slate-300 font-medium">{d.name}</span>
                </div>

                <div className="text-sm font-semibold text-slate-100">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
