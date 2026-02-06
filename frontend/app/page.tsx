"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Share2, BarChart3, Sparkles, Zap, Globe, Users, Trophy, CheckCircle, Star } from "lucide-react"
import { motion } from "framer-motion"
import Particles from "@/components/particles/particles"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-slate-50 overflow-hidden relative">
      {/* Enhanced Particle Background */}
      <Particles />
      
      {/* Animated gradient orbs - Darker theme */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -inset-[500px] opacity-15">
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-spin-slow"
            style={{
              background: "conic-gradient(from 0deg, rgba(30, 64, 175, 0.1), rgba(55, 65, 81, 0.1), rgba(14, 165, 233, 0.1))",
              left: `${mousePosition.x / window.innerWidth * 100}%`,
              top: `${mousePosition.y / window.innerHeight * 100}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(120px)'
            }}
          />
        </div>
        
        {/* Static gradient spots - Darker */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-950/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Enhanced Navigation - Reduced height */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 backdrop-blur-xl bg-gray-900/40 border-b border-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/10"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              DSA-Nexus
            </motion.span>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="gap-2 hover:bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
                >
                  Sign In
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Enhanced Hero Section - Moved upwards and smaller text */}
        <section className="px-6 md:px-12 py-16 md:py-24 text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto space-y-6"
          >
            {/* Animated badge */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-600/20 backdrop-blur-sm"
            >
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-medium">All-in-One DSA Platform</span>
            </motion.div>

            {/* Main heading with gradient text - Smaller */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-6xl font-bold tracking-tight"
              >
                <span className="block bg-gradient-to-r from-gray-100 via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                  Master DSA
                </span>
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Unify your coding journey across platforms. Track progress, gain insights, and showcase your skills with a beautiful portfolio.
              </motion.p>
            </div>

            {/* Animated CTA Buttons - Resized */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden px-6 py-5 rounded-lg text-base font-semibold bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600"
                      initial={false}
                      animate={{ x: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ opacity: 0.2 }}
                    />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/profile/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group gap-2 px-6 py-5 rounded-lg text-base font-semibold border border-gray-700 hover:border-cyan-500/30 hover:bg-gray-900/30 backdrop-blur-sm transition-all duration-300"
                  >
                    <span>Live Demo</span>
                    <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Section - Smaller */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-xl mx-auto"
            >
              {[
                { value: "10K+", label: "Active Users", icon: Users },
                { value: "500K+", label: "Problems Solved", icon: CheckCircle },
                { value: "99%", label: "Satisfaction", icon: Star },
                { value: "4.9/5", label: "Rating", icon: Trophy },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="p-3 rounded-xl bg-gray-900/30 border border-gray-800/50 backdrop-blur-sm"
                >
                  <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section with Darker Theme */}
        <section className="px-6 md:px-12 py-16 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <div className="inline-flex items-center gap-2 text-blue-400 mb-2">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                <span className="text-xs font-semibold">FEATURES</span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                Everything You Need to
                <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Excel in DSA
                </span>
              </h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Unified Progress Dashboard",
                  description: "Aggregate all your DSA activity from LeetCode, Codeforces, HackerRank, and more into one beautiful dashboard.",
                  icon: BarChart3,
                  gradient: "from-blue-900/10 to-indigo-900/10",
                  border: "border-blue-800/30",
                  delay: 0.1
                },
                {
                  title: "Smart Analytics & Insights",
                  description: "AI-powered insights on your performance patterns, weak areas, and improvement suggestions.",
                  icon: TrendingUp,
                  gradient: "from-indigo-900/10 to-gray-900/10",
                  border: "border-indigo-800/30",
                  delay: 0.2
                },
                {
                  title: "Portfolio Builder",
                  description: "Create stunning, recruiter-friendly profiles that automatically update with your progress.",
                  icon: Globe,
                  gradient: "from-cyan-900/10 to-blue-900/10",
                  border: "border-cyan-800/30",
                  delay: 0.3
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                  className={`group relative p-6 rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.gradient} backdrop-blur-xl overflow-hidden`}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-800/30 mb-4"
                    >
                      <feature.icon className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-gray-100 to-gray-200 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <motion.div 
                      className="mt-4 inline-flex items-center gap-2 text-cyan-400 font-medium text-sm"
                      whileHover={{ x: 3 }}
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Preview Section - Darker */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl p-1"
            >
              {/* Glowing border - Darker */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-cyan-900/20 blur-xl" />
              
              <div className="relative bg-gray-900/50 rounded-2xl p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">
                      Interactive
                      <span className="block mt-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Live Dashboard
                      </span>
                    </h3>
                    <p className="text-gray-300">
                      Watch your progress come to life with real-time updates and beautiful visualizations.
                    </p>
                    
                    <ul className="space-y-3">
                      {["Real-time problem tracking", "Difficulty breakdown", "Consistency heatmaps", "Skill progression charts"].map((item, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                          <span className="text-sm text-gray-300">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl blur-xl" />
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-4 border border-gray-800 overflow-hidden">
                      {/* Mock dashboard */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-3 w-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full" />
                          <div className="h-3 w-12 bg-gray-800 rounded-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-16 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800" />
                          ))}
                        </div>
                        <div className="h-24 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section - Darker and smaller */}
        <section className="px-6 md:px-12 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-cyan-900/20 rounded-2xl blur-xl" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800/50 backdrop-blur-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your
                  <span className="block mt-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    DSA Journey?
                  </span>
                </h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Join thousands of developers who've elevated their coding skills and career prospects.
                </p>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden px-8 py-5 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Start Your Journey Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600"
                        initial={false}
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ opacity: 0.2 }}
                      />
                    </Button>
                  </Link>
                </motion.div>
                
                <p className="text-gray-400 mt-4 text-xs">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Enhanced Footer - Darker */}
        <footer className="px-6 md:px-12 py-8 border-t border-gray-800/30 backdrop-blur-xl bg-gray-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <div>
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    DSA-Nexus
                  </div>
                  <div className="text-xs text-gray-400">Elevate your coding journey</div>
                </div>
              </div>
              
              <div className="flex gap-6">
                {["Features", "Pricing", "Documentation", "Contact"].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ y: -1, color: "#60a5fa" }}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                © 2024 DSA-Nexus. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}