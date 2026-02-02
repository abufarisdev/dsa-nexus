"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { countries } from "@/lib/countries"

export function BasicInfoTab() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        country: ""
    })

    // Track initial state to detect changes
    const [initialData, setInitialData] = useState<any>(null)

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getBasicInfo()
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    bio: data.bio || "",
                    country: data.country || ""
                })
                setInitialData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    bio: data.bio || "",
                    country: data.country || ""
                })
            } catch (error) {
                console.error("Failed to fetch basic info", error)
                toast({
                    title: "Error",
                    description: "Failed to load profile information.",
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Check for changes
    const hasChanges = () => {
        if (!initialData) return false
        return (
            formData.firstName !== initialData.firstName ||
            formData.lastName !== initialData.lastName ||
            formData.bio !== initialData.bio ||
            formData.country !== initialData.country
        )
    }

    // Handle Input Change
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Handle Save
    const handleSave = async () => {
        if (!formData.firstName.trim()) {
            toast({
                title: "Validation Error",
                description: "First Name is required.",
                variant: "destructive"
            })
            return
        }

        if (formData.bio.length > 200) {
            toast({
                title: "Validation Error",
                description: "Bio must be less than 200 characters.",
                variant: "destructive"
            })
            return
        }

        setSaving(true)
        try {
            await api.updateBasicInfo({
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                country: formData.country
            })

            // Update initial state to new saved state
            setInitialData({
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                country: formData.country
            })

            toast({
                title: "Success",
                description: "Basic information updated successfully.",
            })
        } catch (error) {
            console.error("Failed to update profile", error)
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <p className="text-sm text-slate-400">Update your personal details here.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800/30 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl space-y-6">

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            className="bg-slate-900/50 border-slate-800/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            className="bg-slate-900/50 border-slate-800/50"
                        />
                    </div>
                </div>

                {/* Email - Read Only */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-slate-500">(Read-only)</span></Label>
                    <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="bg-slate-900/30 border-slate-800/30 text-slate-400 cursor-not-allowed"
                    />
                </div>

                {/* Country */}
                <div className="space-y-2">
                    <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.country}
                        onValueChange={(value) => handleChange("country", value)}
                    >
                        <SelectTrigger className="bg-slate-900/50 border-slate-800/50">
                            <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="bio">Bio</Label>
                        <span className={`text-xs ${formData.bio.length > 200 ? 'text-red-500' : 'text-slate-500'}`}>
                            {formData.bio.length}/200
                        </span>
                    </div>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="bg-slate-900/50 border-slate-800/50 resize-json min-h-[100px]"
                        placeholder="Tell us a bit about yourself..."
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges() || saving}
                        className="w-full md:w-auto min-w-[150px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
