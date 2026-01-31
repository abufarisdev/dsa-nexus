"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface SignupFormProps {
    email: string
    verificationToken: string
    onSuccess: (user: any) => void
}

export function SignupForm({ email, verificationToken, onSuccess }: SignupFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        setError("")

        try {
            const data = await api.signup({
                email,
                verificationToken,
                ...formData
            })
            onSuccess(data.user)
        } catch (err: any) {
            setError(err.response?.data?.error || "Signup failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">First Name</label>
                    <input
                        type="text" required
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Last Name</label>
                    <input
                        type="text" required
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <input
                    type="text" required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                    placeholder="@username"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <input
                    type="password" required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <input
                    type="password" required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
            </button>
        </form>
    )
}
