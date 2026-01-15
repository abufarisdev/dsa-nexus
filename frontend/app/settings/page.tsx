"use client"

import DashboardLayout from "@/app/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Bell, Lock, User } from "lucide-react"

function SettingsContent() {
  return (
    <div className="px-6 md:px-12 py-12">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          <div className="p-6 rounded-xl border border-slate-800/30 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="John Dev" className="bg-slate-900/50 border-slate-800/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" defaultValue="john@example.com" className="bg-slate-900/50 border-slate-800/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                defaultValue="Full-stack developer passionate about DSA and problem solving"
                className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 text-slate-50 text-sm resize-none"
                rows={3}
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="p-6 rounded-xl border border-slate-800/30 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <label>Daily problem reminders</label>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label>Weekly progress reports</label>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <label>Platform sync notifications</label>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h2>
          <div className="p-6 rounded-xl border border-slate-800/30 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button className="w-full">Update Password</Button>
          </div>
        </div>

        {/* Sync Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sync Preferences</h2>
          <div className="p-6 rounded-xl border border-slate-800/30 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sync Frequency</label>
              <select
                defaultValue="hourly"
                className="w-full p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 text-slate-50"
              >
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Last synced:</span>
              <span className="text-slate-400">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
          <div className="p-6 rounded-xl border border-red-900/30 bg-gradient-to-br from-red-950/40 to-red-950/20 backdrop-blur-xl space-y-4">
            <p className="text-sm text-slate-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  )
}
