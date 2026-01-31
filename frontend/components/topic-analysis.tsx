"use client"

interface TopicAnalysisProps {
  topics?: { name: string; solved: number; total: number; percentage: number }[];
}

export function TopicAnalysis({ topics }: TopicAnalysisProps) {
  // If no topics, maybe show empty state or nothing
  if (!topics || topics.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl border border-slate-800/30 bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">DSA Topic Analysis</h3>
        <a href="#" className="text-xs text-cyan-500 hover:text-blue-400 transition-colors">
          Show more →
        </a>
      </div>

      <div className="space-y-5">
        {topics.slice(0, 5).map((topic, idx) => (
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
