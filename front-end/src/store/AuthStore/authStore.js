import { create } from 'zustand';
import axios from 'axios';
const loadUserFromLocalStorage = () => {
  try{
    const userData = localStorage.getItem('user-token') || null
    return userData
  }
  catch(error){
    return null
  }
}
const useAuthStore = create((set) => ({
  user: loadUserFromLocalStorage(),
  isLoading: false,
  error: null,
  messages:[],
  loadMessages: async(userId)=>{
    const response = await axios.get(`/api/users/${userId}`)
    set({ messages: response.data.messages || [] })

  },
  deleteMessages: async(userId,messageIds)=>{
    if(messageIds.length == 1){
      await axios.delete(`/api/users/${userId}/messages/${messageIds[0]}`)
    }
    else{
      await axios.delete(`/api/users/${userId}/messages`, {
        data: {messageIds}
      })
    }
    set(state => ({messages: state.messages.filter(msg => !messageIds.includes(msg._id))}))
    
    return true
    
  },
  login: async(email,password)=>{
    set({ isLoading: true, error: null })
    try{
      const response = await axios.get('/api/users')
      const user = response.data.find((u) => u.email == email && u.password == password || u.tempPassword == password)
      const userTempPassword = response.data.find((u) => u.tempPassword == password)
      if(!user){
        set({error:'Неверные данные',isLoading:false})
        return {success:false}
      }
      else if(user.tempPassword == password){
        localStorage.setItem('force-password-change','true')
        set({user: {_id: user._id,},isLoading:false })
        return { success: true, needsPasswordChange: true }
      }
      else if(!user?.token){
        set({error:'ошибка авторизации: токен отсутствует', isLoading:false})
        return {success:false}
      }
      localStorage.setItem('user-token', user.token)
      set({ 
        user: {
          _id: user._id,
          email: user.email,
          token: user.token,
          name: user.name,
          password:user.password,
          messages: user.messages || []
        }, 
        isLoading: false 
      })
      return { success: true }
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
        set({ error:'пользователь с таким email уже существует', isLoading:false})
        return { success:false}
      }
      const { data: newUser } = await axios.post('/api/users', userData)
      
      if(!newUser?.token){
        set({error:'У вас отсутсвует токен',isLoading:false})
        return {success:false}
      }
      localStorage.setItem('user-token', newUser.token)
      set({ user: newUser, isLoading: false })
      return {success:true}
    }
    catch(error){
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка регистрации'
      set({error:errorMessage,isLoading:false})
      return {success:false}
    }
  },
  logout:()=>{
    localStorage.removeItem('user-token')
    set({user:null})
  },
  setTempPassword: async(email,tempPassword)=>{
    const response = await axios.get('/api/users')
    const user = response.data.find((u) => u.email == email)
    if(!user){
      return { success: false }
    }
    await axios.patch('/api/users/update-temp-password', { email, tempPassword })
    return { success: true }
  
  },
  changePassword: async(newPassword)=>{
    try{
      const user = get().user
      const response = await axios.patch('/api/users/change-password',{
        userId: user._id,
        newPassword
      })
      set((state) => ({user:{...state.user,password:newPassword}}))
      
      return {success:true}
    }
    catch(error){
      return {success:false,error: error.message}
    }
  }
}))

export default useAuthStore