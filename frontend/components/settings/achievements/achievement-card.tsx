"use client"

import { Pencil, Trash2, Award, Calendar, Link as LinkIcon, ExternalLink } from "lucide-react"
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

interface AchievementCardProps {
    data: any
    onEdit: (data: any) => void
    onDelete: (id: string) => void
}

export function AchievementCard({ data, onEdit, onDelete }: AchievementCardProps) {
    const formatDate = (dateObj: { month?: string, year?: number }) => {
        if (!dateObj || (!dateObj.month && !dateObj.year)) return "";
        return `${dateObj.month || ""} ${dateObj.year || ""}`.trim();
    }

    const issueDate = formatDate(data.issueDate);

    return (
        <Card className="border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
            <CardContent className="p-5 flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-10 w-10 mt-1 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-500 shrink-0">
                        <Award className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">{data.title}</h3>

                        {data.description && (
                            <p className="text-slate-400 text-sm">{data.description}</p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
                            {issueDate && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{issueDate}</span>
                                </div>
                            )}

                            {data.url && (
                                <a
                                    href={data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline"
                                >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span>View Certificate</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
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
                                <AlertDialogTitle className="text-white">Delete Achievement?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this achievement from your profile.
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
