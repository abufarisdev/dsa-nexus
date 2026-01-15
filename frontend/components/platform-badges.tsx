"use client"

interface PlatformBadgeProps {
  platforms: Array<{
    name: string
    icon: string
    color: string
    url: string
  }>
}

export function PlatformBadges({ platforms }: PlatformBadgeProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Connected Platforms</h3>
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-3 rounded-full border border-border/30 bg-gradient-to-r ${platform.color} backdrop-blur-xl hover:border-border/60 transition-colors flex items-center gap-2 text-sm font-medium`}
          >
            <span className="text-lg">{platform.icon}</span>
            {platform.name}
          </a>
        ))}
      </div>
    </div>
  )
}
