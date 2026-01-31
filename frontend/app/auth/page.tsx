"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { EmailForm } from "@/components/auth/EmailForm"
import { OTPForm } from "@/components/auth/OTPForm"
import { SignupForm } from "@/components/auth/SignupForm"
import { useProfileStore } from "@/lib/profile-store"

type AuthStep = "EMAIL" | "OTP" | "SIGNUP"

export default function AuthPage() {
    const [step, setStep] = useState<AuthStep>("EMAIL")
    const [email, setEmail] = useState("")
    const [verificationToken, setVerificationToken] = useState("")
    const router = useRouter()
    const { updateProfile } = useProfileStore()

    const handleEmailSuccess = (e: string) => {
        setEmail(e)
        setStep("OTP")
    }

    const handleOTPSuccess = (data: any) => {
        if (data.loginAllowed) {
            // Logged in
            updateProfile({
                name: data.user.firstName ? `${data.user.firstName} ${data.user.lastName}` : data.user.username,
                username: `@${data.user.username}`,
                // ... other fields
            })
            router.push('/dashboard') // Or some protected route
        } else if (data.signupRequired) {
            setVerificationToken(data.verificationToken)
            setStep("SIGNUP")
        }
    }

    const handleSignupSuccess = (user: any) => {
        updateProfile({
            name: `${user.firstName} ${user.lastName}`,
            username: `@${user.username}`
        })
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to access your developer portfolio</p>
                </div>

                {step === "EMAIL" && <EmailForm onSuccess={handleEmailSuccess} />}

                {step === "OTP" && (
                    <OTPForm
                        email={email}
                        onVerified={handleOTPSuccess}
                        onBack={() => setStep("EMAIL")}
                    />
                )}

                {step === "SIGNUP" && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-lg font-semibold text-white mb-4 text-center">Complete Your Profile</h2>
                        <SignupForm
                            email={email}
                            verificationToken={verificationToken}
                            onSuccess={handleSignupSuccess}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
