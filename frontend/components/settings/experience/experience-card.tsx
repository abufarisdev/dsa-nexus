"use client"

import { Pencil, Trash2, Briefcase, Calendar } from "lucide-react"
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

interface ExperienceCardProps {
    data: any
    onEdit: (data: any) => void
    onDelete: (id: string) => void
}

export function ExperienceCard({ data, onEdit, onDelete }: ExperienceCardProps) {
    const formatDate = (date: any) => {
        if (!date || !date.month || !date.year) return ""
        return `${date.month} ${date.year}`
    }

    const period = `${formatDate(data.startDate)} - ${data.isCurrentlyWorking ? 'Present' : formatDate(data.endDate)}`

    return (
        <Card className="group relative overflow-hidden border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
                            <Briefcase className="h-5 w-5" />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-100">{data.jobTitle}</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-400">{data.company}</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{period}</span>
                            </div>

                            {data.description && (
                                <p className="text-sm text-slate-400 max-w-2xl pt-2 leading-relaxed">
                                    {data.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-950 border-slate-800">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Delete Experience?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        This action cannot be undone. This will permanently remove this experience from your profile.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-transparent border-slate-700 text-white hover:bg-slate-800">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(data._id)}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
