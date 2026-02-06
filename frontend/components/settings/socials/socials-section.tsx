"use client"

import { useState, useEffect } from "react"
import { Loader2, Linkedin, Twitter, Globe, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"

export function SocialsSection() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        linkedin: "",
        twitter: "",
        website: "",
        resume: ""
    })

    useEffect(() => {
        loadSocials()
    }, [])

    const loadSocials = async () => {
        try {
            const data = await api.getSocials()
            setFormData({
                linkedin: data.linkedin || "",
                twitter: data.twitter || "",
                website: data.website || "",
                resume: data.resume || ""
            })
        } catch (error) {
            console.error("Failed to load socials", error)
            toast({
                title: "Error",
                description: "Failed to load social links",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const validateInputs = () => {
        // LinkedIn: https://www.linkedin.com/in/<username>
        // Alphanumeric + hyphens, no spaces, no extra paths
        const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (formData.linkedin && !linkedinRegex.test(formData.linkedin)) {
            toast({
                title: "Invalid LinkedIn URL",
                description: "Invalid LinkedIn profile URL. Please enter a valid LinkedIn profile link.",
                variant: "destructive"
            });
            return false;
        }

        // Twitter/X: https://twitter.com/<username> or https://x.com/<username>
        // Alphanumeric + underscores, no extra paths
        const twitterRegex = /^https:\/\/(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/;
        if (formData.twitter && !twitterRegex.test(formData.twitter)) {
            toast({
                title: "Invalid Twitter/X URL",
                description: "Invalid X (Twitter) profile URL. Please enter a valid X profile link.",
                variant: "destructive"
            });
            return false;
        }

        // Resume: Google Drive or Docs only
        const resumeRegex = /^https:\/\/(?:drive|docs)\.google\.com(?:$|\/.*)/;
        if (formData.resume && !resumeRegex.test(formData.resume)) {
            toast({
                title: "Invalid Resume URL",
                description: "Resume link must be a valid Google Drive URL.",
                variant: "destructive"
            });
            return false;
        }

        // Website: Generic URL validation (basic check)
        if (formData.website) {
            try {
                new URL(formData.website);
            } catch (_) {
                toast({
                    title: "Invalid Website URL",
                    description: "Please enter a valid URL for your portfolio website.",
                    variant: "destructive"
                });
                return false;
            }
        }

        return true;
    }

    const handleSave = async () => {
        if (!validateInputs()) return;

        setSaving(true)
        try {
            await api.updateSocials(formData)
            toast({
                title: "Success",
                description: "Social links updated successfully",
            })
        } catch (error) {
            console.error("Failed to update socials", error)
            toast({
                title: "Error",
                description: "Failed to update social links",
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h2 className="text-2xl font-bold text-white">Social Profile</h2>
                <p className="text-slate-400">You can update your social media details here.</p>
            </div>

            <div className="space-y-6">

                {/* LinkedIn */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-48 flex items-center gap-3 text-slate-300">
                        <Linkedin className="w-6 h-6" />
                        <span className="text-lg font-medium">Linkedin {'>'}</span>
                    </div>
                    <Input
                        placeholder="https://www.linkedin.com/in/..."
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="flex-1 bg-slate-900/50 border-slate-700 h-12 text-slate-200 placeholder:text-slate-600 focus-visible:ring-slate-700"
                    />
                </div>

                {/* Twitter / X */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-48 flex items-center gap-3 text-slate-300">
                        <Twitter className="w-6 h-6" />
                        <span className="text-lg font-medium">Twitter {'>'}</span>
                    </div>
                    <Input
                        placeholder="https://twitter.com/..."
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="flex-1 bg-slate-900/50 border-slate-700 h-12 text-slate-200 placeholder:text-slate-600 focus-visible:ring-slate-700"
                    />
                </div>

                {/* Website */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-48 flex items-center gap-3 text-slate-300">
                        <Globe className="w-6 h-6" />
                        <span className="text-lg font-medium">Website {'>'}</span>
                    </div>
                    <Input
                        placeholder="https://www.portfolio.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="flex-1 bg-slate-900/50 border-slate-700 h-12 text-slate-200 placeholder:text-slate-600 focus-visible:ring-slate-700"
                    />
                </div>

                {/* Resume */}
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-48 flex items-center gap-3 text-slate-300">
                        <FileText className="w-6 h-6" />
                        <span className="text-lg font-medium">Resume {'>'}</span>
                    </div>
                    <Input
                        placeholder="https://drive.com/resume"
                        value={formData.resume}
                        onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                        className="flex-1 bg-slate-900/50 border-slate-700 h-12 text-slate-200 placeholder:text-slate-600 focus-visible:ring-slate-700"
                    />
                </div>

                <div className="flex justify-end pt-8">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px] rounded-full"
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>
    )
}
