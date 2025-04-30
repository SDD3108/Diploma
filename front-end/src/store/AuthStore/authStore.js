import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/users');
      const user = response.data.find(u => u.email == email && u.password == password);
      
      if (user) {
        set({ user, isLoading: false });
        return { success: true };
      }
      set({ error: 'Неверный email или пароль', isLoading: false });
      return { success: false };
    } catch (error) {
      set({ error: 'Ошибка сервера при авторизации', isLoading: false });
      return { success: false };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/users', userData);
      set({ user: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: 'Ошибка сервера при регистрации', isLoading: false });
      return { success: false };
    }
  },

  logout: () => set({ user: null }),
}));

export default useAuthStore;