"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { EducationCard } from "./education-card"
import { EducationForm } from "./education-form"
import { Loader2 } from "lucide-react"

export function EducationSection() {
    const [educationList, setEducationList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchEducation = async () => {
        try {
            const data = await api.getEducation()
            setEducationList(data.education || [])
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to load education details.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEducation()
    }, [])

    const handleAdd = async (data: any) => {
        try {
            const res = await api.addEducation(data)
            setEducationList(res.education)
            setIsAdding(false)
            toast({ title: "Success", description: "Education added successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to add education", variant: "destructive" })
        }
    }

    const handleUpdate = async (data: any) => {
        if (!editingId) return
        try {
            const res = await api.updateEducation(editingId, data)
            setEducationList(res.education)
            setEditingId(null)
            toast({ title: "Success", description: "Education updated successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to update education", variant: "destructive" })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await api.deleteEducation(id)
            setEducationList(res.education)
            toast({ title: "Success", description: "Education deleted successfully" })
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete education", variant: "destructive" })
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
                <h2 className="text-2xl font-bold text-white">Education</h2>
                <p className="text-slate-400">Add your education details, including college name, degree, and grades.</p>
            </div>

            {/* List */}
            <div className="space-y-4">
                {educationList.map((edu: any) => (
                    editingId === edu._id ? (
                        <EducationForm
                            key={edu._id}
                            initialData={edu}
                            onSave={handleUpdate}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <EducationCard
                            key={edu._id}
                            data={edu}
                            onEdit={() => {
                                setEditingId(edu._id)
                                setIsAdding(false)
                            }}
                            onDelete={handleDelete}
                        />
                    )
                ))}
            </div>

            {/* Add New */}
            {isAdding ? (
                <EducationForm
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
                        Add Education
                    </Button>
                )
            )}
        </div>
    )
}
