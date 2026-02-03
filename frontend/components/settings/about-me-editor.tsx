"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Code,
    Undo, Redo, Maximize2, Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AboutMeEditorProps {
    initialContent: any
    onSave: (content: any) => Promise<void>
    isSaving: boolean
}

// Helper to determine current block type for dropdown
const getCurrentHeading = (editor: any) => {
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    if (editor.isActive('heading', { level: 4 })) return 'h4'
    if (editor.isActive('heading', { level: 5 })) return 'h5'
    if (editor.isActive('heading', { level: 6 })) return 'h6'
    return 'p' // Default to paragraph
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const currentHeading = getCurrentHeading(editor)

    const setHeading = (value: string) => {
        if (value === 'p') {
            editor.chain().focus().setParagraph().run()
        } else if (value.startsWith('h')) {
            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6
            editor.chain().focus().toggleHeading({ level }).run()
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-800/50 p-2 bg-slate-900/30">

            {/* Heading Dropdown */}
            <Select value={currentHeading} onValueChange={setHeading}>
                <SelectTrigger className="w-[140px] h-8 bg-transparent border-slate-700 text-slate-300">
                    <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="h4">Heading 4</SelectItem>
                    <SelectItem value="h5">Heading 5</SelectItem>
                    <SelectItem value="h6">Heading 6</SelectItem>
                </SelectContent>
            </Select>

            <div className="w-px h-6 bg-slate-800 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('underline')}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-slate-800 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-slate-800 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive('blockquote')}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <Quote className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('codeBlock')}
                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                className="h-8 w-8 data-[state=on]:bg-slate-800 data-[state=on]:text-white hover:bg-slate-800/50 hover:text-slate-200"
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <div className="w-px h-6 bg-slate-800 mx-1" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
                <Redo className="h-4 w-4" />
            </Button>

        </div>
    )
}

export function AboutMeEditor({ initialContent, onSave, isSaving }: AboutMeEditorProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [mode, setMode] = useState<'write' | 'preview'>('write')

    const [hasChanges, setHasChanges] = useState(false)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: 'Write something amazing about yourself...',
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-slate-300',
            },
        },
        onUpdate: ({ editor }) => {
            const currentContent = JSON.stringify(editor.getJSON())
            const startContent = JSON.stringify(initialContent)
            setHasChanges(currentContent !== startContent)
        },
    })

    // Update dirty state if initialContent changes (e.g. after save)
    // We don't overwrite editor content here to avoid cursor jumps if it was just a background refresh.
    // Ideally, we treat initialContent as the "truth".
    useEffect(() => {
        if (editor) {
            const currentContent = JSON.stringify(editor.getJSON())
            const startContent = JSON.stringify(initialContent)
            setHasChanges(currentContent !== startContent)
        }
    }, [initialContent, editor])

    const handleSave = async () => {
        if (editor && hasChanges) {
            const json = editor.getJSON()
            await onSave(json)
            // hasChanges state will be reset by the effect above when parent updates initialContent
        }
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    return (
        <div className={cn(
            "flex flex-col gap-4 transition-all duration-300",
            isFullscreen && "fixed inset-0 z-50 bg-slate-950 p-6"
        )}>

            {/* Header / Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4 border-b border-transparent">
                    <button
                        onClick={() => setMode('write')}
                        className={cn(
                            "pb-2 px-1 text-sm font-medium transition-colors relative",
                            mode === 'write' ? "text-blue-500" : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Write
                        {mode === 'write' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        className={cn(
                            "pb-2 px-1 text-sm font-medium transition-colors relative",
                            mode === 'preview' ? "text-blue-500" : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Preview
                        {mode === 'preview' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isSaving ? "Saving..." : "Update Changes"}
                    </Button>
                </div>
            </div>

            {/* Editor Container */}
            <div className={cn(
                "rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col relative",
                isFullscreen ? "flex-1" : "min-h-[400px]"
            )}>

                {/* Toolbar (Only in Write mode) */}
                {mode === 'write' && (
                    <div className="flex items-center justify-between bg-slate-900/50 pr-2">
                        <MenuBar editor={editor} />
                        <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0 text-slate-400">
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {mode === 'write' ? (
                        <EditorContent editor={editor} />
                    ) : (
                        <div className="prose prose-invert max-w-none p-6 text-slate-300">
                            <div dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '<p>Nothing to preview</p>' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
