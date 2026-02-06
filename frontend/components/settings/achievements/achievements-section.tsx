"use client"

import { useState, useEffect } from "react"
import { Plus, Award, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AchievementCard } from "./achievement-card"
import { AchievementForm } from "./achievement-form"

export function AchievementsSection() {
    const [achievementsList, setAchievementsList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchAchievements = async () => {
        try {
            const data = await api.getAchievements()
            setAchievementsList(data.achievements || [])
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to load achievements.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAchievements()
    }, [])

    const handleAdd = async (data: any) => {
        try {
            const res = await api.addAchievement(data)
            setAchievementsList(res.achievements)
            setIsAdding(false)
            toast({ title: "Success", description: "Achievement added successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to add achievement", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: any) => {
        if (!editingId) return
        try {
            const res = await api.updateAchievement(editingId, data)
            setAchievementsList(res.achievements)
            setEditingId(null)
            toast({ title: "Success", description: "Achievement updated successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update achievement", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await api.deleteAchievement(id)
            setAchievementsList(res.achievements)
            toast({ title: "Success", description: "Achievement deleted successfully" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete achievement", variant: "destructive" })
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h2 className="text-2xl font-bold text-white">Achievements</h2>
                <p className="text-slate-400">Showcase your achievements and certifications to enhance your profile.</p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {achievementsList.map((ach: any) => (
                    editingId === ach._id ? (
                        <AchievementForm
                            key={ach._id}
                            initialData={ach}
                            onSave={handleUpdate}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <AchievementCard
                            key={ach._id}
                            data={ach}
                            onEdit={() => {
                                setEditingId(ach._id)
                                setIsAdding(false)
                            }}
                            onDelete={handleDelete}
                        />
                    )
                ))}
            </div>

            {/* Add New */}
            {isAdding ? (
                <AchievementForm
                    onSave={handleAdd}
                    onCancel={() => setIsAdding(false)}
                />
            ) : (
                !editingId && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        variant="outline"
                        className="w-full border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white h-24 hover:bg-slate-900/50"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Achievement
                    </Button>
                )
            )}
        </div>
    )
}
