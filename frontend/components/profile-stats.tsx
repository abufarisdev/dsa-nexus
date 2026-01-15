interface ProfileStat {
  label: string
  value: string | number
}

interface ProfileStatsProps {
  stats: ProfileStat[]
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-6 rounded-2xl border border-border/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl text-center"
        >
          <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
          <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
