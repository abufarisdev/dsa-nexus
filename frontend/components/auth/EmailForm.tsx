"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface EmailFormProps {
  onSuccess: (email: string) => void
}

export default function EmailForm({ onSuccess }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Request OTP from backend
      await api.requestOTP(email)
      toast.success("OTP sent to your email")
      onSuccess(email)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
      toast.error(err.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
          className="bg-slate-900/50 border-slate-800/50"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Sending OTP...</span>
          </div>
        ) : (
          "Continue with Email"
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        We'll send a one-time password to your email
      </p>
    </form>
  )
}