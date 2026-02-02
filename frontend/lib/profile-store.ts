import { create } from 'zustand'

interface Platform {
  verified: boolean
  url: string
}

interface ProfileState {
  name: string
  username: string
  email: string
  about: string
  location: string
  education: string
  isProfilePublic: boolean
  achievements: string[]
  platforms: {
    leetcode: Platform
    geeksforgeeks: Platform
    hackerrank: Platform
    github: Platform
  }
  updateProfile: (profile: Partial<ProfileState>) => void
  toggleProfilePublic: () => void
  saveToServer: () => Promise<void>
}

// Default platform values
const defaultPlatforms = {
  leetcode: { verified: false, url: 'https://leetcode.com' },
  geeksforgeeks: { verified: false, url: 'https://geeksforgeeks.org' },
  hackerrank: { verified: false, url: 'https://hackerrank.com' },
  github: { verified: false, url: 'https://github.com' },
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  name: 'John Doe',
  username: '@johndoe',
  email: 'john@example.com',
  about: 'Passionate developer solving DSA problems daily. Currently focusing on dynamic programming and graph algorithms.',
  location: 'San Francisco, CA',
  education: 'Stanford University - Computer Science',
  isProfilePublic: true,
  achievements: ['100 Days of Code', 'LeetCode 30-day Challenge', 'Top 10% Codeforces'],
  platforms: defaultPlatforms,
  
  updateProfile: (profile) => set((state) => ({ 
    ...state, 
    ...profile,
    // Ensure platforms has all required properties
    platforms: {
      ...defaultPlatforms,
      ...state.platforms,
      ...(profile.platforms || {})
    }
  })),
  
  toggleProfilePublic: () => set((state) => ({ 
    isProfilePublic: !state.isProfilePublic 
  })),
  
  saveToServer: async () => {
    const state = get()
    console.log('Saving to server:', state)
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 500))
    return Promise.resolve()
  }
}))