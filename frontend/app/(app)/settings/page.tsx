"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicInfoTab } from "@/components/settings/basic-info-tab"
import { ProfileDetailsTab } from "@/components/settings/profile-details-tab"
import { User, Shield, CreditCard, Layers } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container max-w-6xl mx-auto py-10 px-4 md:px-6">
      <Tabs defaultValue="basic-info" className="flex flex-col md:flex-row gap-8 items-start w-full">

        {/* Left Column: Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="space-y-1 px-1">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-slate-400">Manage account</p>
          </div>

          <TabsList className="flex flex-col h-auto bg-transparent space-y-1 p-0 items-stretch bg-transparent border-0">
            <TabsTrigger
              value="basic-info"
              className="justify-start px-4 py-3 data-[state=active]:bg-slate-800/80 data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-all"
            >
              <User className="w-4 h-4 mr-3" />
              Basic Info
            </TabsTrigger>

            <TabsTrigger
              value="profile-details"
              className="justify-start px-4 py-3 data-[state=active]:bg-slate-800/80 data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-all"
            >
              <Layers className="w-4 h-4 mr-3" />
              Profile Details
            </TabsTrigger>

            <TabsTrigger
              value="platforms"
              className="justify-start px-4 py-3 data-[state=active]:bg-slate-800/80 data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-all"
            >
              <Shield className="w-4 h-4 mr-3" />
              Platforms
            </TabsTrigger>

            <TabsTrigger
              value="accounts"
              className="justify-start px-4 py-3 data-[state=active]:bg-slate-800/80 data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 rounded-lg transition-all"
            >
              <CreditCard className="w-4 h-4 mr-3" />
              Accounts
            </TabsTrigger>
          </TabsList>
        </aside>


        {/* Right Column: Content */}
        <div className="flex-1 w-full min-w-0">
          <TabsContent value="basic-info" className="mt-0">
            <BasicInfoTab />
          </TabsContent>

          <TabsContent value="profile-details" className="mt-0">
            <ProfileDetailsTab />
          </TabsContent>

          <TabsContent value="platforms" className="mt-0">
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Platforms tab content coming soon.
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="mt-0">
            <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Accounts tab content coming soon.
            </div>
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}
