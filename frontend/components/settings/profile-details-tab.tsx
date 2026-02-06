"use client"

import { useState, useEffect } from "react"
import { AboutMeEditor } from "./about-me-editor"
import { EducationSection } from "./education/education-section"
import { AchievementsSection } from "./achievements/achievements-section"
import { GraduationCap, Award, Briefcase, Code, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type SubTab = "about" | "education" | "achievements" | "experience" | "socials"

export function ProfileDetailsTab() {
    const [activeTab, setActiveTab] = useState<SubTab>("about")
    const [loading, setLoading] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await api.getBasicInfo()
                setProfileData(data)
            } catch (error) {
                console.error("Failed to load profile", error)
                toast({
                    title: "Error",
                    description: "Failed to load profile details.",
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    const handleSaveAbout = async (content: any) => {
        setSaving(true)
        try {
            await api.updateAboutMe(content)
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            })
            // Refresh local data ideally or just assume success updates state
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to save changes.",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Sub Navigation */}
            <div className="flex items-center overflow-x-auto border-b border-slate-800 pb-1 scrollbar-hide">
                <button
                    onClick={() => setActiveTab("about")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === "about" ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Terminal className="w-4 h-4" />
                    About Me
                </button>
                <button
                    onClick={() => setActiveTab("education")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === "education" ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <GraduationCap className="w-4 h-4" />
                    Education
                </button>
                <button
                    onClick={() => setActiveTab("achievements")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === "achievements" ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Award className="w-4 h-4" />
                    Achievements
                </button>
                <button
                    onClick={() => setActiveTab("experience")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === "experience" ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Briefcase className="w-4 h-4" />
                    Work Experience
                </button>
                <button
                    onClick={() => setActiveTab("socials")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === "socials" ? "text-orange-500 border-b-2 border-orange-500" : "text-slate-400 hover:text-slate-200"
                    )}
                >
                    <Code className="w-4 h-4" />
                    Socials
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === "about" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-white">About</h2>
                            <p className="text-slate-400">Add a brief introduction about yourself to showcase your personality and interests.</p>
                        </div>

                        <AboutMeEditor
                            initialContent={profileData?.about || {}}
                            onSave={handleSaveAbout}
                            isSaving={saving}
                        />
                    </div>
                )}

                {activeTab === "education" && (
                    <EducationSection />
                )}

                {activeTab === "achievements" && (
                    <AchievementsSection />
                )}

                {activeTab !== "about" && activeTab !== "education" && activeTab !== "achievements" && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        <p>This section is coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
