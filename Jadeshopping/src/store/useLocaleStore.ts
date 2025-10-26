import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Locale = 'zh' | 'en';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'zh',
      setLocale: (locale: Locale) => set({ locale }),
      toggleLocale: () => {
        const current = get().locale;
        set({ locale: current === 'zh' ? 'en' : 'zh' });
      }
    }),
    {
      name: 'locale-storage',
      partialize: (state) => ({ locale: state.locale })
    }
  )
);