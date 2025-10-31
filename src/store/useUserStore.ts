import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserState } from '../types';

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      
      login: (user: User) => {
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData }
          });
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn 
      })
    }
  )
);