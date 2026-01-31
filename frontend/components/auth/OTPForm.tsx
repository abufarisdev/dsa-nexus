"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface OTPFormProps {
    email: string
    onVerified: (data: any) => void
    onBack: () => void
}

export function OTPForm({ email, onVerified, onBack }: OTPFormProps) {
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const data = await api.verifyOTP(email, otp)
            onVerified(data)
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Verification Code</label>
                    <button type="button" onClick={onBack} className="text-xs text-slate-400 hover:text-white">Change Email</button>
                </div>
                <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none text-center tracking-[0.5em] text-2xl font-mono"
                    placeholder="000000"
                />
                <p className="text-xs text-slate-500">Sent to {email}</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Code"}
            </button>
        </form>
    )
}
