"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmailForm from "@/components/auth/EmailForm"
import OTPForm from "@/components/auth/OTPForm"
import SignupForm from "@/components/auth/SignupForm"

type AuthStep = "email" | "otp" | "signup"

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("email")
  const [email, setEmail] = useState("")
  const [verificationToken, setVerificationToken] = useState("")

  const handleEmailSuccess = (email: string) => {
    setEmail(email)
    setStep("otp")
  }

  const handleOTPSuccess = (data: any) => {
    if (data.loginAllowed) {
      // User exists, store token and redirect
      localStorage.setItem('token', data.token)
      // You might want to fetch user profile here
      window.location.href = "/dashboard"
    } else if (data.signupRequired) {
      setVerificationToken(data.verificationToken)
      setStep("signup")
    }
  }

  const handleSignupSuccess = (data: any) => {
    // Store token and redirect
    localStorage.setItem('token', data.token)
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(96,165,250,0.1),transparent)]" />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)",
            left: "5%",
            top: "15%",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)",
            left: "40%",
            top: "70%",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8 backdrop-blur-sm bg-slate-950/50 border-b border-slate-800/30">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm"
            >
              DX
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              DSA Nexus
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-slate-400 hover:text-slate-50 bg-transparent border-slate-800/50">
              ← Back to Home
            </Button>
          </Link>
        </nav>

        {/* Main Auth Container */}
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Floating Glass Card */}
            <div className="relative">
              {/* Background Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />

              {/* Glass Card */}
              <div className="relative rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        DX
                      </div>
                      <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Welcome to DSA Nexus</h1>
                  <p className="text-slate-400 text-sm">
                    {step === "email" && "Enter your email to continue"}
                    {step === "otp" && `Enter OTP sent to ${email}`}
                    {step === "signup" && "Complete your profile"}
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="flex mb-8 justify-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "email" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      1
                    </div>
                    <div className={`w-12 h-1 ${step === "otp" || step === "signup" ? "bg-blue-600" : "bg-slate-800"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "otp" ? "bg-blue-600 text-white" : step === "signup" ? "bg-slate-800 text-slate-400" : "bg-slate-800 text-slate-400"}`}>
                      2
                    </div>
                    <div className={`w-12 h-1 ${step === "signup" ? "bg-blue-600" : "bg-slate-800"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "signup" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      3
                    </div>
                  </div>
                </div>

                {/* Form Container with Smooth Transition */}
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === "email" && <EmailForm onSuccess={handleEmailSuccess} />}
                  {step === "otp" && (
                    <OTPForm
                      email={email}
                      onSuccess={handleOTPSuccess}
                      onBack={() => setStep("email")}
                    />
                  )}
                  {step === "signup" && (
                    <SignupForm
                      email={email}
                      verificationToken={verificationToken}
                      onSuccess={handleSignupSuccess}
                      onBack={() => setStep("otp")}
                    />
                  )}
                </motion.div>

                {/* Demo Credentials Note */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500">
                    OTP will be sent to your email (simulated for demo)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}