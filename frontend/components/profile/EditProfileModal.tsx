"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import  { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"

interface ProfileData {
  name: string
  username: string
  about: string
  location: string
  education: string
}

interface EditProfileModalProps {
  initialData: ProfileData
  onSave: (data: ProfileData) => Promise<void>
}

export function EditProfileModal({ initialData, onSave }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(initialData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(formData)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost"
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700"
        >
          <Edit2 className="w-3.5 h-3.5 text-slate-300" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300">Username</Label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-800 border border-r-0 border-slate-700 rounded-l-md text-slate-400">
                @
              </span>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white rounded-l-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about" className="text-slate-300">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500 min-h-[100px] resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              placeholder="Enter your location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="education" className="text-slate-300">Education</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              placeholder="Enter your education"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}     