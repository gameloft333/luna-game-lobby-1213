import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TEST_MODE_EMAILS } from '../config/testMode';

interface SettingsState {
  testMode: boolean;
  toggleTestMode: () => void;
  canAccessTestMode: (email: string | null | undefined) => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      testMode: false,
      toggleTestMode: () => set((state) => ({ testMode: !state.testMode })),
      canAccessTestMode: (email) => {
        if (!email) return false;
        return TEST_MODE_EMAILS.includes(email.toLowerCase());
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);