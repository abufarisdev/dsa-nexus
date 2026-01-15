"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Share2 } from "lucide-react"

export function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-lg">
      <div className="px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-bold text-sm">
            DX
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            DSA Nexus
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-transparent">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </div>
    </nav>
  )
}
