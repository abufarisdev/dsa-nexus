"use client"

import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EducationFormProps {
    initialData?: any
    onSave: (data: any) => Promise<void>
    onCancel: () => void
}

export function EducationForm({ initialData, onSave, onCancel }: EducationFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        degree: initialData?.degree || "",
        institution: initialData?.institution || "",
        gradeType: initialData?.gradeType || "CGPA",
        gradeValue: initialData?.gradeValue || "",
        startDate: {
            month: initialData?.startDate?.month || "",
            year: initialData?.startDate?.year || ""
        },
        endDate: {
            month: initialData?.endDate?.month || "",
            year: initialData?.endDate?.year || ""
        }
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { toast } = useToast()

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
    const futureYears = Array.from({ length: 10 }, (_, i) => currentYear + i + 1)
    const allYears = [...futureYears.reverse(), ...years]

    const degrees = [
        "High School", "Intermediate", "Bachelor of Technology (BTech)", "Associate Degree", "Bachelor of Arts(BA)", "Bachelor of Science (BS)", "Bachelor of Engineering (BE)", "Bachelor of Arts", "Master of Technology", "Master of Engineering", "Master of Computer Applications", "Master of Science", "Master of Commerce", "Master of Arts", "Doctor of Philosophy", "Diploma"
    ]




    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value }
            // Real-time validation for the changed field
            if (errors[field]) {
                const newErrors = { ...errors }
                delete newErrors[field]
                setErrors(newErrors)
            }
            return updated
        })
    }

    const handleDateChange = (type: 'start' | 'end', field: 'month' | 'year', value: any) => {
        setFormData(prev => ({
            ...prev,
            [`${type}Date`]: {
                ...prev[`${type}Date` as 'startDate' | 'endDate'],
                [field]: value
            }
        }))
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.degree.trim()) newErrors.degree = "Degree is required"
        if (!formData.institution.trim()) newErrors.institution = "Institution is required"
        if (!formData.gradeValue) newErrors.gradeValue = "Grade value is required"

        if (formData.gradeValue) {
            const grade = parseFloat(formData.gradeValue)
            if (isNaN(grade)) {
                newErrors.gradeValue = "Grade must be a number"
            } else {
                if (formData.gradeType === 'GPA' && grade > 4) newErrors.gradeValue = "GPA cannot exceed 4.0"
                if (formData.gradeType === 'CGPA' && grade > 10) newErrors.gradeValue = "CGPA cannot exceed 10.0"
                if (formData.gradeType === 'Percentage' && grade > 100) newErrors.gradeValue = "Percentage cannot exceed 100"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Check validity for 'Save' button disable state (optional strictness)
    const isValid = () => {
        const hasRequired = !!formData.degree && !!formData.institution && !!formData.gradeValue
        // We could run full validation here, but let's keep it simple: enable if required fields present
        // The real validation happens on submit or blur. 
        // For "Disable Save until required fields are valid":
        if (!hasRequired) return false;

        const grade = parseFloat(formData.gradeValue)
        if (isNaN(grade)) return false
        if (formData.gradeType === 'GPA' && grade > 4) return false
        if (formData.gradeType === 'CGPA' && grade > 10) return false
        if (formData.gradeType === 'Percentage' && grade > 100) return false

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        try {
            await onSave({
                ...formData,
                gradeValue: parseFloat(formData.gradeValue),
                startDate: formData.startDate.month || formData.startDate.year ? formData.startDate : undefined,
                endDate: formData.endDate.month || formData.endDate.year ? formData.endDate : undefined
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
                    {/* Buttons Row - Top Right (Optional placement, but often requested in "like this" prompts) */}
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
                        {/* Degree - Full Width */}
                        <div className="space-y-2">
                            <Label className="text-slate-200">Degree <span className="text-red-500">*</span></Label>
                            <Select
                                value={formData.degree}
                                onValueChange={(val) => handleChange("degree", val)}
                            >
                                <SelectTrigger className={cn("w-full bg-slate-800 border-slate-700 text-slate-100", errors.degree && "border-red-500 focus-visible:ring-red-500")}>
                                    <SelectValue placeholder="Select your education level" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 max-h-[300px]">
                                    {degrees.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.degree && <p className="text-xs text-red-500">{errors.degree}</p>}
                        </div>

                        {/* Institution - Full Width */}
                        <div className="space-y-2">
                            <Label htmlFor="institution" className="text-slate-200">School / College / University <span className="text-red-500">*</span></Label>
                            <Input
                                id="institution"
                                placeholder="Search for your college"
                                value={formData.institution}
                                onChange={(e) => handleChange("institution", e.target.value)}
                                className={cn("bg-slate-800 border-slate-700 text-slate-100", errors.institution && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.institution && <p className="text-xs text-red-500">{errors.institution}</p>}
                        </div>

                        {/* Grade Section */}
                        <div className="space-y-4">
                            <Label className="text-slate-200">Grade <span className="text-red-500">*</span></Label>

                            {/* Grade Type Pills */}
                            <div className="flex gap-2">
                                {/* Using simple buttons as pills */}
                                {['GPA', 'Percentage', 'CGPA'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => handleChange("gradeType", type)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                            formData.gradeType === type
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Grade Value Input */}
                            <div className="relative">
                                <Label htmlFor="gradeValue" className="sr-only">Grade Value</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="gradeValue"
                                        type="number"
                                        step="0.01"
                                        placeholder={formData.gradeType === 'Percentage' ? "e.g. 85" : "0"}
                                        value={formData.gradeValue}
                                        onChange={(e) => handleChange("gradeValue", e.target.value)}
                                        className={cn("bg-slate-800 border-slate-700 text-slate-100 max-w-[200px]", errors.gradeValue && "border-red-500 focus-visible:ring-red-500")}
                                    />
                                    <span className="text-slate-500 text-sm font-medium">
                                        {formData.gradeType === 'Percentage' ? "percent" :
                                            formData.gradeType === 'CGPA' ? "Out of 10" : "Out of 4"}
                                    </span>
                                </div>
                                {errors.gradeValue && <p className="text-xs text-red-500 mt-1">{errors.gradeValue}</p>}
                            </div>
                        </div>

                        {/* Dates Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label className="text-slate-200">From</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        value={formData.startDate.month}
                                        onValueChange={(val) => handleDateChange('start', 'month', val)}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={formData.startDate.year?.toString()}
                                        onValueChange={(val) => handleDateChange('start', 'year', parseInt(val))}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                            {allYears.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <Label className="text-slate-200">To</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Select
                                        value={formData.endDate.month}
                                        onValueChange={(val) => handleDateChange('end', 'month', val)}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                            {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={formData.endDate.year?.toString()}
                                        onValueChange={(val) => handleDateChange('end', 'year', parseInt(val))}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                                            <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 h-[200px]">
                                            {allYears.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </CardContent>
        </Card >
    )
}
