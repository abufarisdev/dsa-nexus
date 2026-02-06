"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Eye, EyeOff, Lock, User, X, ArrowLeft, Shield, AlertCircle } from "lucide-react"
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
  const [acceptedTerms, setAcceptedTerms] = useState(false)

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

    if (!acceptedTerms) {
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
      default: return "bg-gray-700"
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
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Create Account</h2>
        <p className="text-sm text-gray-400">Complete your registration to get started</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-300 text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {errors.submit}
          </motion.div>
        )}

        {/* Email display and back button */}
        <div className="flex items-center justify-between text-sm mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="text-gray-400 bg-gray-900/30 px-3 py-1 rounded-lg">
            Email: <span className="text-gray-300 font-medium">{email}</span>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                className={`w-full px-3 py-2.5 rounded-lg bg-gray-900/30 border ${
                  errors.fullName || errors.firstName 
                    ? 'border-red-500/50' 
                    : 'border-gray-800/50'
                } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
              />
              {errors.fullName || errors.firstName ? (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName || errors.firstName}
                </p>
              ) : null}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
                className={`w-full px-3 py-2.5 rounded-lg bg-gray-900/30 border ${
                  errors.lastName 
                    ? 'border-red-500/50' 
                    : 'border-gray-800/50'
                } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
              />
              {errors.lastName ? (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Username</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                @
              </div>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="john_doe"
                className={`w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-900/30 border ${
                  errors.username 
                    ? 'border-red-500/50' 
                    : 'border-gray-800/50'
                } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
              />
            </div>
            {errors.username ? (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.username}
              </p>
            ) : null}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-900/30 border ${
                  errors.password 
                    ? 'border-red-500/50' 
                    : 'border-gray-800/50'
                } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Password strength</span>
                  <span className={`font-medium ${
                    passwordStrength === "weak" ? "text-red-400" :
                    passwordStrength === "medium" ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
            {errors.password ? (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-900/30 border ${
                  errors.confirmPassword 
                    ? 'border-red-500/50' 
                    : 'border-gray-800/50'
                } text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
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
                className="flex items-center justify-center w-5 h-5 rounded border border-gray-700 bg-gray-900/50 cursor-pointer peer-checked:border-blue-500/50 peer-checked:bg-gradient-to-r peer-checked:from-blue-600/20 peer-checked:to-cyan-600/20 transition-all"
              >
                {acceptedTerms && (
                  <Check className="w-3 h-3 text-cyan-400" />
                )}
              </label>
            </div>
            <label htmlFor="terms-checkbox" className="text-gray-400 cursor-pointer select-none text-sm leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {errors.terms && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.terms}
            </motion.p>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 hover:from-blue-600 hover:via-indigo-600 hover:to-cyan-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Password requirements */}
        <div className="p-4 rounded-lg bg-gray-900/30 border border-gray-800/50">
          <h4 className="text-xs font-medium text-gray-300 mb-2">Password Requirements</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`} />
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`} />
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`} />
              At least one number
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-700'}`} />
              At least one special character
            </li>
          </ul>
        </div>
      </form>
    </div>
  )
}