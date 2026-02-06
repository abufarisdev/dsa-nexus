import { useProfileStore } from "@/lib/profile-store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export interface DashboardStats {
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    acceptanceRate?: number;
}

export interface PlatformStat {
    name: string;
    solved: number;
    streak: number;
    icon: string;
    color: string;
    verified: boolean;
    url: string;
}

export interface ActivityDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface FullStats {
    userId: string;
    stats: DashboardStats;
    platforms: PlatformStat[];
    heatmap: ActivityDay[]; // Normalized heatmap
    topics?: { name: string; solved: number; total: number; percentage: number }[];
    // Dev specific
    devStats?: {
        totalContributions: number;
        totalCommits: number;
        totalPRs: number;
        totalIssues: number;
        totalStarsGiven: number;
        languages: Record<string, number>;
    };
}

// Helper to get the auth token
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Helper to set auth header
const getAuthHeaders = () => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const api = {
    // Auth - OTP based
    requestOTP: async (email: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to request OTP");
        }
        return res.json();
    },

    verifyOTP: async (email: string, otp: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to verify OTP");
        }
        return res.json();
    },

    signup: async (data: {
        email: string;
        verificationToken: string;
        firstName: string;
        lastName: string;
        username: string;
        password: string;
        confirmPassword: string;
    }): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Signup failed");
        }
        return res.json();
    },

    // Check username availability
    checkUsername: async (username: string): Promise<{ available: boolean }> => {
        const res = await fetch(`${API_BASE}/auth/check-username?username=${username}`);
        if (!res.ok) {
            throw new Error("Failed to check username");
        }
        return res.json();
    },

    logout: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders(),
            credentials: 'include'
        });
        return res.json();
    },

    getProfile: async (userId?: string): Promise<any> => {
        const id = userId || "me";
        const res = await fetch(`${API_BASE}/profile/${id}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
    },

    // Socials
    getSocials: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/socials`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch socials");
        return res.json();
    },

    updateSocials: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/socials`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update socials");
        return res.json();
    },

    updateProfile: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update profile");
        return res.json();
    },

    // Basic Info Tab
    getBasicInfo: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/basic-info`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch basic info");
        return res.json();
    },

    updateBasicInfo: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/basic-info`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update basic info");
        return res.json();
    },

    // About Me
    getAboutMe: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/about`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch about me");
        return res.json();
    },

    updateAboutMe: async (content: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/about`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content })
        });
        if (!res.ok) throw new Error("Failed to update about me");
        return res.json();
    },

    // Education
    getEducation: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/education`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch education details");
        return res.json();
    },

    addEducation: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/education`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to add education");
        return res.json();
    },

    updateEducation: async (educationId: string, data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/education/${educationId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update education");
        return res.json();
    },

    deleteEducation: async (educationId: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/education/${educationId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete education");
        return res.json();
    },


    // Achievements
    getAchievements: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/achievements`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch achievements");
        return res.json();
    },

    addAchievement: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/achievements`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to add achievement");
        }
        return res.json();
    },

    updateAchievement: async (achievementId: string, data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/achievements/${achievementId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update achievement");
        }
        return res.json();
    },

    deleteAchievement: async (achievementId: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/achievements/${achievementId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete achievement");
        return res.json();
    },


    // Work Experience
    getWorkExperience: async (): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/work-experience`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch work experience");
        return res.json();
    },

    addWorkExperience: async (data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/work-experience`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to add work experience");
        }
        return res.json();
    },

    updateWorkExperience: async (experienceId: string, data: any): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/work-experience/${experienceId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to update work experience");
        }
        return res.json();
    },

    deleteWorkExperience: async (experienceId: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/profile/details/work-experience/${experienceId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete work experience");
        return res.json();
    },

    // Combined Problem Solving Stats
    getCombinedStats: async (userId: string = "me"): Promise<any> => {
        const res = await fetch(`${API_BASE}/portfolio/${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch combined stats");
        return res.json();
    },

    // LeetCode Stats
    getLeetCodeStats: async (userId: string = "me"): Promise<any> => {
        const res = await fetch(`${API_BASE}/platforms/leetcode/${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch LeetCode stats");
        return res.json();
    },

    // Codeforces Stats
    getCodeforcesStats: async (userId: string = "me"): Promise<any> => {
        const res = await fetch(`${API_BASE}/platforms/codeforces/${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            console.warn("Codeforces endpoint might be missing or empty");
            return null;
        }
        return res.json();
    },

    // GitHub Dev Stats
    getGitHubStats: async (userId: string = "me"): Promise<any> => {
        const res = await fetch(`${API_BASE}/devStats/github/${userId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch GitHub stats");
        return res.json();
    },
};