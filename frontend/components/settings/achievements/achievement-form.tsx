"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AchievementFormProps {
    initialData?: any
    onSave: (data: any) => Promise<void>
    onCancel: () => void
}

export function AchievementForm({ initialData, onSave, onCancel }: AchievementFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        url: initialData?.url || "",
        issueDate: {
            month: initialData?.issueDate?.month || "",
            year: initialData?.issueDate?.year || ""
        }
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value }
            // Clear error on change
            if (errors[field]) {
                const newErrors = { ...errors }
                delete newErrors[field]
                setErrors(newErrors)
            }
            return updated
        })
    }

    const handleDateChange = (field: 'month' | 'year', value: any) => {
        setFormData(prev => ({
            ...prev,
            issueDate: {
                ...prev.issueDate,
                [field]: value
            }
        }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        const googleDriveRegex = /^https?:\/\/(drive|docs)\.google\.com\/.*$/;

        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.url.trim()) {
            newErrors.url = "URL is required"
        } else if (!googleDriveRegex.test(formData.url)) {
            newErrors.url = "Must be a valid Google Drive link"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValid = () => {
        const googleDriveRegex = /^https?:\/\/(drive|docs)\.google\.com\/.*$/;

        if (!formData.title.trim()) return false;
        if (!formData.url.trim() || !googleDriveRegex.test(formData.url)) return false;

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await onSave({
                ...formData,
                issueDate: formData.issueDate.month || formData.issueDate.year ? formData.issueDate : undefined
            })
        } catch (error) {
            console.error("Form save error", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border border-slate-700 bg-slate-900/50 animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-end gap-3 pb-2">
                        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !isValid()}
                            className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-200">Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                placeholder="e.g. Hackathon Winner"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className={cn("bg-slate-800 border-slate-700 text-slate-100", errors.title && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-200">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe your achievement..."
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="bg-slate-800 border-slate-700 text-slate-100 min-h-[100px]"
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <Label htmlFor="url" className="text-slate-200">Certificate URL (Google Drive) <span className="text-red-500">*</span></Label>
                            <Input
                                id="url"
                                placeholder="https://drive.google.com/..."
                                value={formData.url}
                                onChange={(e) => handleChange("url", e.target.value)}
                                className={cn("bg-slate-800 border-slate-700 text-slate-100", errors.url && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
                            <p className="text-xs text-slate-500">Must be a valid Google Drive or Docs link.</p>
                        </div>

                        {/* Issue Date */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Issue Date</Label>
                            <div className="grid grid-cols-2 gap-4 max-w-[300px]">
                                <Select
                                    value={formData.issueDate.month}
                                    onValueChange={(val) => handleDateChange('month', val)}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={formData.issueDate.year?.toString()}
                                    onValueChange={(val) => handleDateChange('year', parseInt(val))}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                        {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
