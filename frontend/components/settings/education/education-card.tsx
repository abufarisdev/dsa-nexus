"use client"

import { Pencil, Trash2, GraduationCap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EducationCardProps {
    data: any
    onEdit: (data: any) => void
    onDelete: (id: string) => void
}

export function EducationCard({ data, onEdit, onDelete }: EducationCardProps) {
    const formatDate = (dateObj: { month?: string, year?: number }) => {
        if (!dateObj || (!dateObj.month && !dateObj.year)) return "";
        return `${dateObj.month || ""} ${dateObj.year || ""}`.trim();
    }

    const start = formatDate(data.startDate);
    const end = formatDate(data.endDate);
    const dateRange = (start || end) ? `${start} - ${end || "Present"}` : "";

    return (
        <Card className="border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-10 w-10 mt-1 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500 shrink-0">
                        <GraduationCap className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">{data.institution}</h3>
                        <p className="text-slate-300 font-medium">{data.degree}</p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
                            {dateRange && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{dateRange}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span>{data.gradeType}: <span className="text-emerald-400 font-medium">{data.gradeValue}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(data)}
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Profile Entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this education entry from your profile.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent text-white hover:bg-slate-800 border-slate-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete(data._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
