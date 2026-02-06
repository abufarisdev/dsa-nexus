"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ExperienceFormProps {
    initialData?: any
    onSave: (data: any) => Promise<void>
    onCancel: () => void
}

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

// Generate last 50 years to current year + 5
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 55 }, (_, i) => currentYear + 5 - i)

export function ExperienceForm({ initialData, onSave, onCancel }: ExperienceFormProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        jobTitle: "",
        company: "",
        description: "",
        startDate: {
            month: MONTHS[new Date().getMonth()],
            year: new Date().getFullYear().toString()
        },
        endDate: {
            month: "",
            year: ""
        },
        isCurrentlyWorking: false
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                jobTitle: initialData.jobTitle || "",
                company: initialData.company || "",
                description: initialData.description || "",
                startDate: {
                    month: initialData.startDate?.month || "",
                    year: initialData.startDate?.year?.toString() || ""
                },
                endDate: {
                    month: initialData.endDate?.month || "",
                    year: initialData.endDate?.year?.toString() || ""
                },
                isCurrentlyWorking: initialData.isCurrentlyWorking || false
            })
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.jobTitle || !formData.company) {
            toast({
                title: "Missing fields",
                description: "Job Description and Company are required",
                variant: "destructive"
            })
            return
        }

        if (!formData.startDate.month || !formData.startDate.year) {
            toast({
                title: "Missing fields",
                description: "Start Date is required",
                variant: "destructive"
            })
            return
        }

        setLoading(true)
        try {
            await onSave({
                ...formData,
                startDate: {
                    month: formData.startDate.month,
                    year: parseInt(formData.startDate.year)
                },
                endDate: formData.isCurrentlyWorking ? null : {
                    month: formData.endDate.month,
                    year: parseInt(formData.endDate.year)
                }
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="p-6 space-y-6">

                {/* Header Actions */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white h-9 px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-6"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </div>

                {/* Job Description (Title) */}
                <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Description <span className="text-red-500">*</span></Label>
                    <Input
                        id="jobTitle"
                        placeholder=""
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="bg-slate-950/50 border-slate-800 h-11"
                    />
                </div>

                {/* Company */}
                <div className="space-y-2">
                    <Label htmlFor="company">Company <span className="text-red-500">*</span></Label>
                    <Input
                        id="company"
                        placeholder=""
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="bg-slate-950/50 border-slate-800 h-11"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder=""
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-slate-950/50 border-slate-800 min-h-[140px] resize-none"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* From Date */}
                    <div className="space-y-2">
                        <Label>From</Label>
                        <div className="flex gap-2">
                            <Select
                                value={formData.startDate.month}
                                onValueChange={(v) => setFormData(prev => ({
                                    ...prev,
                                    startDate: { ...prev.startDate, month: v }
                                }))}
                            >
                                <SelectTrigger className="bg-slate-950/50 border-slate-800 h-11">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={formData.startDate.year}
                                onValueChange={(v) => setFormData(prev => ({
                                    ...prev,
                                    startDate: { ...prev.startDate, year: v }
                                }))}
                            >
                                <SelectTrigger className="bg-slate-950/50 border-slate-800 h-11">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map(y => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* To Date */}
                    <div className="space-y-2">
                        <Label className={cn(formData.isCurrentlyWorking && "text-slate-500")}>To</Label>
                        <div className="flex gap-2">
                            <Select
                                value={formData.endDate.month}
                                onValueChange={(v) => setFormData(prev => ({
                                    ...prev,
                                    endDate: { ...prev.endDate, month: v }
                                }))}
                                disabled={formData.isCurrentlyWorking}
                            >
                                <SelectTrigger className="bg-slate-950/50 border-slate-800 h-11">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map(m => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={formData.endDate.year}
                                onValueChange={(v) => setFormData(prev => ({
                                    ...prev,
                                    endDate: { ...prev.endDate, year: v }
                                }))}
                                disabled={formData.isCurrentlyWorking}
                            >
                                <SelectTrigger className="bg-slate-950/50 border-slate-800 h-11">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map(y => (
                                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                        id="current"
                        checked={formData.isCurrentlyWorking}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCurrentlyWorking: checked as boolean }))}
                        className="data-[state=checked]:bg-white data-[state=checked]:text-black border-slate-600"
                    />
                    <Label htmlFor="current" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-200">
                        I currently work here
                    </Label>
                </div>
            </CardContent>
        </Card>
    )
}
