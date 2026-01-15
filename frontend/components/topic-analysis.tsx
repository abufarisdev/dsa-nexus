"use client"

const topics = [
  { name: "Arrays & Hashing", solved: 42, total: 50, percentage: 84 },
  { name: "Trees & Graphs", solved: 38, total: 48, percentage: 79 },
  { name: "Dynamic Programming", solved: 25, total: 40, percentage: 62 },
  { name: "Two Pointers", solved: 31, total: 35, percentage: 88 },
  { name: "Linked Lists", solved: 28, total: 32, percentage: 87 },
]

export function TopicAnalysis() {
  return (
    <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">DSA Topic Analysis</h3>
        <a href="#" className="text-xs text-cyan-500 hover:text-blue-400 transition-colors">
          Show more →
        </a>
      </div>

      <div className="space-y-5">
        {topics.map((topic, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{topic.name}</span>
              <span className="text-xs text-slate-400">
                {topic.solved} / {topic.total}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-900/50 border border-slate-800/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">{topic.percentage}% complete</div>
          </div>
        ))}
      </div>

      <button className="mt-6 text-xs text-cyan-500 hover:text-blue-400 transition-colors font-medium">
        View all topics →
      </button>
    </div>
  )
}
