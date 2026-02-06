"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ExperienceCard } from "./experience-card"
import { ExperienceForm } from "./experience-form"
import { Loader2 } from "lucide-react"

export function WorkExperienceSection() {
    const [experienceList, setExperienceList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        fetchExperience()
    }, [])

    const fetchExperience = async () => {
        try {
            const data = await api.getWorkExperience()
            setExperienceList(data.workExperience || [])
        } catch (error) {
            console.error(error)
            // Silent fail or toast
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (data: any) => {
        try {
            if (editingId) {
                const res = await api.updateWorkExperience(editingId, data)
                setExperienceList(res.workExperience)
                toast({ title: "Success", description: "Experience updated successfully" })
            } else {
                const res = await api.addWorkExperience(data)
                setExperienceList(res.workExperience)
                toast({ title: "Success", description: "Experience added successfully" })
            }
            setIsAdding(false)
            setEditingId(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save experience",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await api.deleteWorkExperience(id)
            setExperienceList(res.workExperience)
            toast({ title: "Success", description: "Experience deleted successfully" })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete experience",
                variant: "destructive"
            })
        }
    }

    if (loading) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h2 className="text-2xl font-bold text-white">Work Experience</h2>
                <p className="text-slate-400">Add your work experience, internships, and other relevant experiences.</p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {experienceList.map((exp: any) => {
                    if (editingId === exp._id) {
                        return (
                            <ExperienceForm
                                key={exp._id}
                                initialData={exp}
                                onSave={handleSave}
                                onCancel={() => setEditingId(null)}
                            />
                        )
                    }
                    return (
                        <ExperienceCard
                            key={exp._id}
                            data={exp}
                            onEdit={(data) => {
                                setEditingId(data._id)
                                setIsAdding(false)
                            }}
                            onDelete={handleDelete}
                        />
                    )
                })}
            </div>

            {/* Add Button or Form */}
            {isAdding ? (
                <ExperienceForm
                    onSave={handleSave}
                    onCancel={() => setIsAdding(false)}
                />
            ) : !editingId && (
                <Button
                    onClick={() => setIsAdding(true)}
                    className="w-full border border-dashed border-slate-700 bg-slate-900/30 text-slate-400 hover:bg-slate-900/50 hover:text-white h-auto py-8"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">Add Work Experience</span>
                    </div>
                </Button>
            )}
        </div>
    )
}
