"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Mail, Link, Image, Globe, FileText, MapPin, GraduationCap, ExternalLink, CheckCircle2, User, Plus, Trophy, Calendar } from "lucide-react"
import { EditProfileModal } from "@/components/profile/EditProfileModal"
import { useProfileStore } from "@/lib/profile-store"
import { api } from "@/lib/api"
import { useEffect } from "react"
import { motion } from "framer-motion"

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

  // Hydrate store with real connection status
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const ghData = await api.getGitHubStats().catch(() => null);
        updateProfile({
          platforms: {
            ...platforms,
            github: { ...platforms.github, verified: !!ghData },
          }
        });
      } catch (e) {
        console.error("Failed to check connections", e);
      }
    };

    checkConnections();
  }, []);

  const handleSaveProfile = async (data: any) => {
    updateProfile({
      name: data.name,
      username: `@${data.username}`,
      about: data.about,
      location: data.location,
      education: data.education
    })

    try {
      await saveToServer()
    } catch (error) {
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
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[280px] shrink-0 bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-800/50 flex flex-col"
    >
      {/* Fixed Header Section */}
      <div className="shrink-0 space-y-3 p-4 border-b border-gray-800/50">
        {/* Profile Visibility Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <span className="text-xs text-gray-400">Public Profile</span>
          </div>
          <Switch
            checked={isProfilePublic}
            onCheckedChange={toggleProfilePublic}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-cyan-600"
          />
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-800/50">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-lg font-bold">
              <span className="text-white">{getInitials()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1">
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
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-100 truncate">{name}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-blue-400 truncate">{username}</span>
              <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gradient-to-r from-orange-600/10 to-amber-600/10 border border-orange-600/30 text-orange-400 hover:text-orange-300 hover:border-orange-500/50 text-xs"
        >
          Get Your Card
        </Button>

        {/* Quick Actions Row */}
        <div className="flex items-center justify-between py-1">
          {[
            { icon: Mail, label: "Email" },
            { icon: Link, label: "Links" },
            { icon: Image, label: "Media" },
            { icon: Globe, label: "Website" },
            { icon: FileText, label: "Docs" },
          ].map((item) => (
            <button
              key={item.label}
              className="p-1.5 rounded hover:bg-gray-800/50 transition-colors group"
              title={item.label}
            >
              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
            </button>
          ))}
        </div>

        {/* Profile Info */}
        <div className="space-y-2 pt-1">
          {location && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {education && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <GraduationCap className="w-3 h-3" />
              <span className="truncate">{education}</span>
            </div>
          )}
        </div>
      </div>

      {/* Extended Content Section - No fixed height */}
      <div className="flex-1 p-4 space-y-4">
        {/* About Section */}
        {about && (
          <div className="space-y-1.5">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium">ABOUT</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {about}
            </p>
          </div>
        )}

        {/* Problem Solving Stats */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800/50 overflow-hidden">
          <button
            onClick={() => setIsProblemStatsOpen(!isProblemStatsOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
          >
            <span className="text-sm font-medium text-gray-200">Platforms</span>
            {isProblemStatsOpen ? (
              <ChevronUp className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            )}
          </button>

          {isProblemStatsOpen && (
            <div className="px-3 pb-3 space-y-2">
              {[
                {
                  name: "LeetCode",
                  platform: platforms.leetcode,
                  color: "from-orange-500 to-red-500",
                  initials: "LC"
                },
                {
                  name: "GeeksForGeeks",
                  platform: platforms.geeksforgeeks,
                  color: "from-green-500 to-emerald-600",
                  initials: "GFG"
                },
                {
                  name: "HackerRank",
                  platform: platforms.hackerrank,
                  color: "from-emerald-500 to-teal-600",
                  initials: "HR"
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="group flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <span className="text-xs font-bold text-white">{item.initials}</span>
                    </div>
                    <span className="text-xs text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.platform.verified && (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    )}
                    <a
                      href={item.platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-500 hover:text-blue-400" />
                    </a>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-1 border-dashed border-gray-700 text-xs text-gray-400 hover:text-gray-300 hover:border-blue-500/50"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Platform
              </Button>
            </div>
          )}
        </div>

        {/* Development Stats */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800/50 overflow-hidden">
          <button
            onClick={() => setIsDevStatsOpen(!isDevStatsOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
          >
            <span className="text-sm font-medium text-gray-200">Development</span>
            {isDevStatsOpen ? (
              <ChevronUp className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            )}
          </button>

          {isDevStatsOpen && (
            <div className="px-3 pb-3">
              <div className="group flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300">GitHub</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {platforms.github.verified && (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  )}
                  <a
                    href={platforms.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 text-gray-500 hover:text-blue-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-medium text-gray-300">Achievements</h5>
              <Trophy className="w-3 h-3 text-yellow-500" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {achievements.map((achievement, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gradient-to-r from-blue-600/10 to-cyan-600/10 text-blue-300 rounded border border-blue-800/30"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Activity Summary */}
        <div className="bg-gray-900/30 rounded-lg border border-gray-800/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300">Activity Summary</span>
            <Calendar className="w-3 h-3 text-gray-500" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Problems Solved</span>
              <span className="text-gray-300 font-medium">312</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Active Days</span>
              <span className="text-gray-300 font-medium">45</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Current Streak</span>
              <span className="text-gray-300 font-medium">7 days</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Accuracy</span>
              <span className="text-gray-300 font-medium">78%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-300">Recent Activity</h5>
          <div className="space-y-2">
            {[
              { platform: "LeetCode", problem: "Two Sum", time: "2 hours ago", difficulty: "Easy" },
              { platform: "Codeforces", problem: "A. Watermelon", time: "1 day ago", difficulty: "Easy" },
              { platform: "HackerRank", problem: "Array Manipulation", time: "2 days ago", difficulty: "Medium" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-2 p-2 rounded hover:bg-gray-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.difficulty === "Easy" ? "bg-green-500" :
                  activity.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-300 truncate">{activity.problem}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{activity.platform}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags/Skills */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-300">Top Skills</h5>
          <div className="flex flex-wrap gap-1.5">
            {["Dynamic Programming", "Graph Theory", "Binary Search", "Sliding Window", "Greedy", "Trees"].map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 rounded border border-gray-700/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-3 border-t border-gray-800/50 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Last Updated</span>
            <span className="text-gray-400">Just now</span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}