import { useProfileStore } from "@/lib/profile-store";

const API_BASE = "/api";

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

// Helper to get Authorization header or similar if needed (using authStub/middleware logic from backend, 
// usually we rely on cookies or the backend handles auth implicitly for now since we are mocking authStub).
// But we need the userId. Ideally, the backend knows the current user. 
// If specific userId is needed (public profile), we pass it. 
// For "My Profile" (dashboard), we use the logged-in user endpoints or pass the ID if known.
// Since the backend endpoints like `/api/portfolio/:userId` require ID, we need to get it.
// The `useProfileStore` has some user data, but maybe not the internal _id unless we saved it.
// Let's assume for this MVP we fetch for a hardcoded user ID logic or fetch "me" if backend supports it.
// Looking at backend: `getPortfolio` puts `userId` in params.
// `getGitHubStats` uses `req.user` if no param.
// Use a placeholder ID or fetch from a 'me' endpoint? 
// The backend authStub uses '507f1f77bcf86cd799439011'. We can use this for the "My Dashboard" view 
// if we don't have a real auth system on frontend yet.

const DEMO_USER_ID = "507f1f77bcf86cd799439011";

export const api = {
    // Combined Problem Solving Stats
    getCombinedStats: async (userId: string = DEMO_USER_ID): Promise<any> => {
        const res = await fetch(`${API_BASE}/portfolio/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch combined stats");
        return res.json();
    },

    // LeetCode Stats
    getLeetCodeStats: async (userId: string = DEMO_USER_ID): Promise<any> => {
        const res = await fetch(`${API_BASE}/platforms/leetcode/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch LeetCode stats");
        return res.json();
    },

    // Codeforces Stats (Assumed endpoint exists or reusing/mocking structure for now if missing)
    // Backend had `codeforcesController`, let's assume it has similar `getProfile` or we use combined.
    // Actually, combined `getPortfolio` returns `aggregatedStats` and `topicStats`.
    // If we want raw Codeforces, we might need to hit a specific CF endpoint if built, 
    // or filter from combined if stored there. 
    // Checking backend... `codeforcesController` exists.
    getCodeforcesStats: async (userId: string = DEMO_USER_ID): Promise<any> => {
        // Note: If distinct endpoint doesn't exist, we might have to rely on portfolio data.
        // Let's implement fetch but handle 404.
        const res = await fetch(`${API_BASE}/platforms/codeforces/${userId}`);
        if (!res.ok) {
            console.warn("Codeforces endpoint might be missing or empty");
            return null;
        }
        return res.json();
    },

    // GitHub Dev Stats
    getGitHubStats: async (userId: string = DEMO_USER_ID): Promise<any> => {
        const res = await fetch(`${API_BASE}/devStats/github/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch GitHub stats");
        return res.json();
    },

    // Auth
    requestOTP: async (email: string) => {
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

    verifyOTP: async (email: string, otp: string) => {
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

    signup: async (data: any) => {
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

    logout: async () => {
        const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        return res.json();
    }
};
