"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Mail, Link, Image, Globe, FileText, MapPin, GraduationCap, ExternalLink, CheckCircle2 } from "lucide-react"
import { EditProfileModal } from "@/components/profile/EditProfileModal"
import { useProfileStore } from "@/lib/profile-store"

export default function ProfilePanel() {
  const [isProblemStatsOpen, setIsProblemStatsOpen] = useState(true)
  const [isDevStatsOpen, setIsDevStatsOpen] = useState(false)
  
  const {
    name,
    username,
    about,
    location,
    education,
    isProfilePublic,
    achievements,
    platforms,
    updateProfile,
    toggleProfilePublic,
    saveToServer
  } = useProfileStore()

  const handleSaveProfile = async (data: any) => {
    // Update local store immediately
    updateProfile({
      name: data.name,
      username: `@${data.username}`,
      about: data.about,
      location: data.location,
      education: data.education
    })
    
    // Try to save to server (handles errors gracefully)
    try {
      await saveToServer()
    } catch (error) {
      // Error is already handled in saveToServer, just continue
      console.log('Profile saved locally')
    }
  }

  const getInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="w-[300px] shrink-0 h-full overflow-hidden border-r border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.1)] rounded-r-xl flex flex-col">
      
      {/* Fixed Header Section */}
      <div className="shrink-0 space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_8px_#3b82f6]" />
            <span>Public Profile</span>
          </div>
          <Switch 
            checked={isProfilePublic}
            onCheckedChange={toggleProfilePublic}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <div className="flex flex-col items-center text-center gap-4 pb-4 border-b border-slate-800/80 relative">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/30">
              <span className="text-white">{getInitials()}</span>
            </div>
            <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/30 ring-offset-2 ring-offset-slate-950"></div>
            
            <EditProfileModal 
              initialData={{
                name,
                username: username.replace('@', ''),
                about,
                location,
                education
              }}
              onSave={handleSaveProfile}
            />
          </div>

          <div>
            <div className="font-bold text-xl text-white">{name}</div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-sm text-blue-400">{username}</span>
              <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/20" />
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-slate-900/50 border-slate-700 text-orange-400 hover:text-orange-300 hover:bg-slate-800/50 hover:border-orange-500/30 hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)] transition-all"
        >
          Get your Card
        </Button>

        <div className="flex items-center justify-between py-2 border-y border-slate-800/80">
          <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <Link className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <Image className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <Globe className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors group">
            <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
          </button>
        </div>

        <div className="space-y-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <span className="truncate">{education}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-6 space-y-6 pt-0">
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-medium">ABOUT</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {about}
          </p>
        </div>

        {/* Problem Solving Stats Accordion */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800/60 overflow-hidden">
          <button 
            onClick={() => setIsProblemStatsOpen(!isProblemStatsOpen)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <span className="font-medium text-slate-200">Problem Solving Stats</span>
            {isProblemStatsOpen ? 
              <ChevronUp className="w-4 h-4 text-slate-500" /> : 
              <ChevronDown className="w-4 h-4 text-slate-500" />
            }
          </button>
          
          {isProblemStatsOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between group hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">LC</span>
                  </div>
                  <span className="text-sm text-slate-300">LeetCode</span>
                </div>
                <div className="flex items-center gap-2">
                  {platforms.leetcode.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <a 
                    href={platforms.leetcode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between group hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">GFG</span>
                  </div>
                  <span className="text-sm text-slate-300">GeeksForGeeks</span>
                </div>
                <div className="flex items-center gap-2">
                  {platforms.geeksforgeeks.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <a 
                    href={platforms.geeksforgeeks.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between group hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">HR</span>
                  </div>
                  <span className="text-sm text-slate-300">HackerRank</span>
                </div>
                <div className="flex items-center gap-2">
                  {platforms.hackerrank.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <a 
                    href={platforms.hackerrank.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  </a>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-2 border-dashed border-slate-700 text-slate-400 hover:text-slate-300 hover:border-blue-500/50 hover:bg-slate-800/30"
              >
                + Add Platform
              </Button>
            </div>
          )}
        </div>

        {/* Development Stats Accordion */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800/60 overflow-hidden">
          <button 
            onClick={() => setIsDevStatsOpen(!isDevStatsOpen)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <span className="font-medium text-slate-200">Development Stats</span>
            {isDevStatsOpen ? 
              <ChevronUp className="w-4 h-4 text-slate-500" /> : 
              <ChevronDown className="w-4 h-4 text-slate-500" />
            }
          </button>
          
          {isDevStatsOpen && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between group hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-300">GitHub</span>
                </div>
                <div className="flex items-center gap-2">
                  {platforms.github.verified && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  <a 
                    href={platforms.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 hover:text-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-3">
          <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800/50">
            <h5 className="text-sm font-medium text-slate-300 mb-2">Achievements</h5>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded border border-blue-800/50"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
          
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/50">
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span className="text-slate-400">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}