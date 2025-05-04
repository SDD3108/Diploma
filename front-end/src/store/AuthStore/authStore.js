import { create } from 'zustand';
import axios from 'axios';
import { persist } from 'zustand/middleware'
const loadUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('user-token')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    return null;
  }
}
const useAuthStore = create((set) => ({
  user: loadUserFromLocalStorage(),
  isLoading: false,
  error: null,

  login: async(email, password)=>{
    set({ isLoading: true, error: null })
    try{
      const response = await axios.get('/api/users')
      const user = response.data.find((u) => u.email == email && u.password == password)
      if(user){
        localStorage.setItem('user-token',JSON.stringify(user))
        set({user, isLoading:false})
        return {success: true }
      }
      set({error: 'неверный email или пароль', isLoading:false})
      return { success: false }
    }
    catch(error){
      set({error: 'ошибка сервера при авторизации', isLoading:false})
      return { success: false }
    }
  },
  register: async(userData)=>{
    set({isLoading:true, error:null})
    try{
      const getUsers = await axios.get('/api/users')
      const sameUser = getUsers.data.some((u) => u.email == userData.email)
      if(sameUser){
        set({ error:'пользователь с таким email уже существует', isLoading:false});
        return { success:false}
      }
      const response = await axios.post('/api/users',userData)
      localStorage.setItem('user-token', JSON.stringify(response.data))
      set({user:response.data,isLoading:false})
      return {success:true}
    }
    catch(error){
      set({error:'ошибка сервера при регистрации',isLoading:false})
      return {success:false}
    }
  },

  logout:()=>{
    localStorage.removeItem('user-token')
    set({user:null})
  },
}))

export default useAuthStore