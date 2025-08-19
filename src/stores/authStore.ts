import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'user@example.com' && password === 'password') {
          const userData = {
            id: '1',
            name: 'John Doe',
            email: email,
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          };
          
          set({ user: userData, loading: false });
          return true;
        }
        
        set({ loading: false });
        return false;
      },

      register: async (name: string, email: string, password: string): Promise<boolean> => {
        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          id: Date.now().toString(),
          name,
          email,
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        };
        
        set({ user: userData, loading: false });
        return true;
      },

      logout: () => {
        set({ user: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);