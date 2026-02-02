"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/auth")
        } else {
            setAuthorized(true)
        }
    }, [router])

    // Prevent flash of unauthenticated content
    if (!authorized) {
        return null
    }

    return <>{children}</>
}
