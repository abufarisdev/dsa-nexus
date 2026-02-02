"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface OTPFormProps {
  email: string
  onSuccess: (data: any) => void
  onBack: () => void
}

export default function OTPForm({ email, onSuccess, onBack }: OTPFormProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = await api.verifyOTP(email, otp)
      onSuccess(data)
    } catch (err: any) {
      setError(err.message || "Invalid OTP")
      toast.error(err.message || "Invalid OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
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
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Email
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">
            Enter the 6-digit code sent to
          </p>
          <p className="font-medium text-slate-300">{email}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 block text-center">
            OTP Code
          </label>
          <div className="flex justify-center">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              required
              maxLength={6}
              className="w-48 text-center text-3xl tracking-[0.5em] bg-slate-900/50 border border-slate-800/50 rounded-xl py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
              placeholder="000000"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Verifying...</span>
          </div>
        ) : (
          "Verify OTP"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          onClick={() => {
            // Resend OTP logic
            toast.info("OTP resent to your email")
          }}
        >
          Didn't receive code? Resend
        </button>
      </div>
    </form>
  )
}