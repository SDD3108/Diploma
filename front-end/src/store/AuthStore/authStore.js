import { create } from 'zustand';
import axios from 'axios';
import jwt from 'jsonwebtoken'

const loadUserFromLocalStorage = () => {
  try{
    const userData = localStorage.getItem('user-token')
    return userData ? JSON.parse(userData) : null
  }
  catch(error){
    return null
  }
}
const useAuthStore = create((set) => ({
  user: loadUserFromLocalStorage(),
  isLoading: false,
  error: null,

  initialize: ()=>{
    const token = localStorage.getItem('user-token')
    if(token){
      try{
        const decoded = jwt.decode(token)
        set({user:decoded })
      }
      catch(error){
        localStorage.removeItem('user-token')
      }
    }
  },
  login: async(email, password)=>{
    set({ isLoading: true, error: null })
    try{
      const response = await axios.get('/api/users')
      const user = response.data.find((u) => u.email == email && u.password == password)
      if(user){
        localStorage.setItem('user-token',user.token)
        set({user: user, isLoading: false})
        return { success: true }
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
      const secketKey = process.env.JWT_SECRET
      const tokenTime = process.env.JWT_EXPIRES_IN
      const { data: newUser } = await axios.post('/api/users',userData)
      const token = jwt.sign(
        {userId:newUser._id},
        secketKey,
        {expiresIn:tokenTime}
      )
      await axios.put(`/api/users/${newUser._id}`,{
        token:token
      })
      localStorage.setItem('user-token', token)
      set({user:newUser.data,isLoading:false})
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