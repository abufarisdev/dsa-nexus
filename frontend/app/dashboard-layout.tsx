"use client"

import type React from "react"
import ProfilePanel from "@/components/profile-panel"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* LEFT: Profile Panel (desktop only) */}
      <aside className="hidden lg:block">
        <ProfilePanel />
      </aside>

      {/* RIGHT: Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <span className="text-sm font-semibold">DSA Nexus</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
