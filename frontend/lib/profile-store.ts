import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlatformData {
  verified: boolean
  url: string
}

interface ProfileStore {
  name: string
  username: string
  about: string
  location: string
  education: string
  isProfilePublic: boolean
  achievements: string[]
  platforms: {
    leetcode: PlatformData
    geeksforgeeks: PlatformData
    hackerrank: PlatformData
    github: PlatformData
  }
  updateProfile: (data: Partial<ProfileStore>) => void
  toggleProfilePublic: () => void
  saveToServer: () => Promise<void>
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      name: "Hassan Rahman",
      username: "@Rahman",
      about: "Full-stack developer passionate about building scalable applications and solving complex problems. Currently focused on modern web technologies and system design.",
      location: "India",
      education: "University of Engineering and Technology",
      isProfilePublic: true,
      achievements: ["Top 5%", "100+ Problems", "2y Experience"],
      
      platforms: {
        leetcode: { verified: true, url: "https://leetcode.com" },
        geeksforgeeks: { verified: true, url: "https://geeksforgeeks.org" },
        hackerrank: { verified: true, url: "https://hackerrank.com" },
        github: { verified: true, url: "https://github.com" }
      },

      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      
      toggleProfilePublic: () => set((state) => ({ 
        isProfilePublic: !state.isProfilePublic 
      })),

      saveToServer: async () => {
        const profile = get()
        
        try {
          // Try to save to backend if API exists
          const response = await fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: profile.name,
              username: profile.username.replace('@', ''),
              about: profile.about,
              location: profile.location,
              education: profile.education
            })
          })
          
          if (!response.ok) {
            // If API returns error, just log it but don't throw
            console.warn('Profile API not available, saving locally only')
            return
          }
          
          console.log('Profile saved successfully to server')
        } catch (error) {
          // If fetch fails (network error, no endpoint), just save locally
          console.log('Using local storage only for profile data')
          // Don't throw error - let it save locally via persist middleware
        }
      }
    }),
    {
      name: 'profile-storage',
      getStorage: () => localStorage,
    }
  )
)