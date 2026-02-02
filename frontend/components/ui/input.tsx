"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  error?: string
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-300 block">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-slate-900/50 border border-slate-800/50
              text-slate-50 placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
              transition-all duration-200
              ${icon ? 'pl-10' : 'pl-4'}
              ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30' : ''}
              ${className}
            `}
            {...props}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"