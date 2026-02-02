"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Eye, EyeOff, Lock, User, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "sonner"

type PasswordStrength = "weak" | "medium" | "strong"

interface SignupFormProps {
  email: string
  verificationToken: string
  onSuccess: (user: any) => void
  onBack: () => void
}

export default function SignupForm({ email, verificationToken, onSuccess, onBack }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("weak")
  const [acceptedTerms, setAcceptedTerms] = useState(false) // Add this state

  // Check password strength
  useEffect(() => {
    const password = formData.password
    if (!password) {
      setPasswordStrength("weak")
      return
    }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 1) setPasswordStrength("weak")
    else if (strength <= 3) setPasswordStrength("medium")
    else setPasswordStrength("strong")
  }, [formData.password])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.fullName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!acceptedTerms) { // Add this validation
      newErrors.terms = "You must accept the terms and privacy policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const data = await api.signup({
        email,
        verificationToken,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      toast.success("Account created successfully!")
      onSuccess(data)

    } catch (err: any) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." })
      toast.error(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))

    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }))
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "strong": return "bg-green-500"
      default: return "bg-slate-700"
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak": return "Weak"
      case "medium": return "Medium"
      case "strong": return "Strong"
      default: return ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {errors.submit}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to OTP
        </button>
        <div className="text-sm text-slate-400">
          Email: <span className="text-slate-300">{email}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
            icon={<User className="w-4 h-4" />}
            error={errors.fullName || errors.firstName}
            className="bg-slate-900/50 border-slate-800/50"
          />
          <Input
            label="Last Name"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Doe"
            icon={<User className="w-4 h-4" />}
            error={errors.lastName}
            className="bg-slate-900/50 border-slate-800/50"
          />
        </div>

        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="john_doe"
          icon={<span className="text-slate-400 text-sm">@</span>}
          error={errors.username}
          className="bg-slate-900/50 border-slate-800/50"
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              className="bg-slate-900/50 border-slate-800/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Password strength</span>
                <span className={`font-medium ${passwordStrength === "weak" ? "text-red-400" :
                    passwordStrength === "medium" ? "text-yellow-400" :
                      "text-green-400"
                  }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: passwordStrength === "weak" ? "33%" :
                      passwordStrength === "medium" ? "66%" :
                        "100%"
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${getPasswordStrengthColor()}`}
                />
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            icon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword}
            className="bg-slate-900/50 border-slate-800/50 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Fixed Terms Checkbox */}
        <div className="flex items-start space-x-2 text-sm">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="sr-only peer"
            />
            <label
              htmlFor="terms-checkbox"
              className="flex items-center justify-center w-4 h-4 rounded border border-slate-700 bg-slate-900/50 cursor-pointer peer-checked:bg-gradient-to-r peer-checked:from-blue-600/20 peer-checked:to-purple-600/20"
            >
              {acceptedTerms && (
                <Check className="w-3 h-3 text-cyan-500" />
              )}
            </label>
          </div>
          <label htmlFor="terms-checkbox" className="text-slate-400 cursor-pointer select-none">
            I agree to the{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>

        {errors.terms && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm"
          >
            {errors.terms}
          </motion.p>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="ml-2">Creating account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </form>
  )
}