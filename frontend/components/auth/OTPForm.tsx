"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react"
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

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text')
    const numbers = paste.replace(/\D/g, '').slice(0, 6)
    if (numbers) {
      setOtp(numbers)
      e.preventDefault()
    }
  }

  // Auto-focus next input (simulated with single input)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp.length > 0) {
      setOtp(prev => prev.slice(0, -1))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 mb-4">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-400">Enter the 6-digit code sent to your email</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {error}
          </motion.div>
        )}

        {/* Email display and back button */}
        <div className="flex items-center justify-between text-sm mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-2 text-gray-400 bg-gray-900/30 px-3 py-1.5 rounded-lg">
            <Mail className="w-3 h-3" />
            <span className="text-gray-300 font-medium truncate max-w-[150px]">{email}</span>
          </div>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400 text-center">
            Enter the 6-digit code
          </label>
          
          <div className="flex justify-center">
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                required
                maxLength={6}
                className="w-48 text-center text-3xl tracking-[0.5em] bg-gray-900/30 border border-gray-800/50 rounded-lg py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                placeholder="000000"
                autoComplete="one-time-code"
              />
              {/* Visual OTP indicator */}
              <div className="flex justify-center gap-2 mt-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < otp.length 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* OTP boxes visual alternative (optional display) */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`w-10 h-12 flex items-center justify-center rounded-lg border-2 text-2xl font-bold font-mono transition-all ${
                  otp[index]
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-white'
                    : 'bg-gray-900/30 border-gray-800/50 text-gray-600'
                }`}
              >
                {otp[index] || "•"}
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Verify OTP</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Resend OTP */}
        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 mx-auto"
            onClick={() => {
              toast.info("OTP resent to your email")
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Didn't receive code? Resend
          </button>
        </div>

        {/* Timer and info */}
        <div className="pt-4 border-t border-gray-800/30">
          <div className="text-xs text-gray-500 text-center space-y-2">
            <p>The code will expire in <span className="text-yellow-400 font-medium">5:00</span></p>
            <p className="flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              This code is confidential. Do not share it with anyone.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}