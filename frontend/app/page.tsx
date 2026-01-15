"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Share2, BarChart3 } from "lucide-react"

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
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)",
            left: "10%",
            top: "20%",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
            right: "15%",
            bottom: "10%",
          }}
        />
        <div
          className="absolute w-72 h-72 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
            left: "50%",
            top: "60%",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8 backdrop-blur-sm bg-slate-950/80 border-b border-slate-800/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              DX
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              DSA Nexus
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 bg-transparent">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>

        {/* Hero Section */}  
        <section className="px-6 md:px-12 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Gradient text logo */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-pretty">
                <span className="block">One link.</span>
                <span className="block">One journey.</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  All your DSA.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Unified DSA progress tracking and developer portfolio. Connect your coding platforms and build your
                perfect developer portfolio in one shareable link.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/profile/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-slate-800/50 hover:bg-slate-900 bg-transparent"
                >
                  View Sample Profile <Share2 className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating card demo */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 blur-2xl" />
              <div className="relative p-8 rounded-2xl border border-slate-800/30 bg-slate-900/40 backdrop-blur-xl">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: TrendingUp, label: "Unified Progress", desc: "All platforms in one view" },
                    { icon: BarChart3, label: "Analytics", desc: "Consistency insights" },
                    { icon: Share2, label: "Shareable", desc: "Recruiter-friendly profile" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-3 text-center">
                      <div className="flex justify-center">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-slate-800/30">
                          <item.icon className="w-6 h-6 text-cyan-500" />
                        </div>
                      </div>
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Premium Features</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything you need to showcase your DSA journey professionally
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Unified Progress Tracking",
                  description:
                    "Aggregate DSA problem-solving activity from LeetCode, Codeforces, and more into one dashboard.",
                  gradient: "from-blue-600/10 to-purple-600/10",
                },
                {
                  title: "Analytics & Insights",
                  description:
                    "Visualize consistency patterns, difficulty distribution, and long-term progress with interactive charts.",
                  gradient: "from-purple-600/10 to-cyan-500/10",
                },
                {
                  title: "Shareable Portfolio",
                  description:
                    "Create a recruiter-friendly profile link to showcase your skills, consistency, and dedication.",
                  gradient: "from-cyan-500/10 to-blue-600/10",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl border border-slate-800/30 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl hover:border-slate-800/60 transition-colors`}
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to showcase your DSA journey?</h2>
            <p className="text-lg text-slate-400">
              Start building your premium developer portfolio today. It takes less than 2 minutes to get started.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-12 border-t border-slate-800/30 backdrop-blur-sm bg-slate-950/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500" />
              <span>DSA Nexus © 2026</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-50 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-50 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-50 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
