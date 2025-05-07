// Zustand store for application-wide state

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Create store with persistence to localStorage
const useAppStore = create(
  devtools(
    persist(
      (set) => ({
        // 🧠 الحالة العامة
        user: null,
        theme: 'light',
        accentColor: '#7c3aed',
        voiceEnabled: true,
        lastPrompt: '',
        sessionId: null,

        // 🎮 الأكشنز
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),

        setTheme: (theme) => set({ theme }),
        setAccentColor: (color) => set({ accentColor: color }),

        toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
        setPrompt: (prompt) => set({ lastPrompt: prompt }),
        setSessionId: (id) => set({ sessionId: id }),

        reset: () => set({
          user: null,
          theme: 'light',
          accentColor: '#7c3aed',
          voiceEnabled: true,
          lastPrompt: '',
          sessionId: null,
        })
      }),
      {
        name: 'mashaaer-storage', // Name for the localStorage item
        partialize: (state) => ({
          // Only persist these fields to localStorage
          user: state.user,
          theme: state.theme,
          accentColor: state.accentColor,
          voiceEnabled: state.voiceEnabled
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
);

export default useAppStore;
