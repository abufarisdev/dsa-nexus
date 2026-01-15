"use client"

import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  name: string
  username: string
  tagline: string
  profileUrl: string
}

export function ProfileHeader({ name, username, tagline, profileUrl }: ProfileHeaderProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
  }

  return (
    <div className="relative mb-12">
      {/* Gradient background */}
      <div className="absolute inset-0 h-32 md:h-48 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10" />

      <div className="px-6 md:px-12 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-bold text-4xl border border-border/30 shadow-2xl">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{name}</h1>
              <p className="text-muted-foreground">@{username}</p>
            </div>
            <p className="text-lg text-foreground max-w-md">{tagline}</p>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCopyLink}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-foreground"
                size="sm"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
