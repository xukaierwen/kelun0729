import { create } from 'zustand';

// 用户状态管理
const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  role: 'headquarters', // headquarters, region, area
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setRole: (role) => set({ role }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

// 工作台状态管理
const useWorkbenchStore = create((set) => ({
  metrics: null,
  todos: [],
  alerts: [],
  loading: false,
  
  setMetrics: (metrics) => set({ metrics }),
  setTodos: (todos) => set({ todos }),
  setAlerts: (alerts) => set({ alerts }),
  setLoading: (loading) => set({ loading }),
}));

export { useUserStore, useWorkbenchStore };
