"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Home,
    Globe,
    ClipboardList,
    Layout,
    Binoculars,
    FileCode,
    Calendar,
    User,
    LogOut,
    ChevronRight,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// Menu Configuration
const data = {
    navMain: [
        {
            title: "Home",
            url: "/dashboard", // Assuming Dashboard is Home for authenticated users
            icon: Home,
            isActive: true,
        },
    ],
    sections: [
        {
            title: "PROFILE TRACKER",
            items: [
                {
                    title: "Portfolio",
                    url: "/profile", // Need to verify if this route exists, usually /profile/me or similar, but spec says "Portfolio"
                    icon: Globe,
                },
            ],
        },
        {
            title: "QUESTION TRACKER",
            items: [
                {
                    title: "Company Wise Kit",
                    url: "/company-wise-kit",
                    icon: ClipboardList,
                },
                {
                    title: "My Workspace",
                    url: "/workspace",
                    icon: Layout,
                },
                {
                    title: "Explore Sheets",
                    url: "/sheets/explore",
                    icon: Binoculars,
                },
                {
                    title: "My Sheets",
                    url: "/sheets/my",
                    icon: FileCode,
                },
            ],
        },
        {
            title: "EVENT TRACKER",
            items: [
                {
                    title: "Contests",
                    url: "/contests",
                    icon: Calendar,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const router = useRouter()
    const { state } = useSidebar()

    const handleLogout = async () => {
        // Clear auth state
        try {
            // Call logout API if exists, or just clear local storage
            localStorage.removeItem("token")
            // Redirect to login
            router.push("/auth")
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 text-primary-foreground">
                        <span className="font-bold">DX</span>
                    </div>
                    {state === "expanded" && (
                        <span className="font-bold truncate">DSA Nexus</span>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* Home Item */}
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.url}
                                    tooltip={item.title}
                                >
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Sections */}
                {data.sections.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname.startsWith(item.url)}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Edit Profile"
                            isActive={pathname === "/settings"}
                        >
                            <Link href="/settings">
                                <User />
                                <span>Edit Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip="Log Out"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                            <LogOut />
                            <span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
