import { create } from 'zustand';
import axios from 'axios';
// const getUsers = async()=>{
//   const response = await axios.get('/api/users')
//   console.log(response.data)
// }
// getUsers()
const loadUserFromLocalStorage = () => {
  try{
    const userData = localStorage.getItem('user-token')
    return userData ? userData : null
  }
  catch(error){
    return null
  }
}
const useAuthStore = create((set) => ({
  user: loadUserFromLocalStorage(),
  isLoading: false,
  error: null,
  // SD310807Sd$
  // @gmail.com
  login: async(email, password)=>{
    set({ isLoading: true, error: null })
    try{
      const response = await axios.get('/api/users')
      console.log(password);
      
      const user = response.data.find((u) => u.email == email && u.password == password || u.tempPassword == password)
      const userTempPassword = response.data.find((u) => u.tempPassword == password)
      console.log(1);
      
      if(!user){
        console.log(2);
        set({error:'Неверные данные',isLoading:false})
        return {success:false}
      }
      else if(user.tempPassword == password){
        console.log(3);
        localStorage.setItem('force-password-change','true')
        return { success: true, needsPasswordChange: true }
      }
      else if(!user?.token){
        console.log(4);
        set({error:'ошибка авторизации: токен отсутствует', isLoading:false})
        return {success:false}
      }
      console.log(5);
      localStorage.setItem('user-token', user.token)
      console.log(6);
      set({ 
        user: {
          _id: user._id,
          email: user.email,
          token: user.token,
          name: user.name,
          password:user.password,
        }, 
        isLoading: false 
      })
      console.log(7);
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
      // console.log('storeReg',1)
      const sameUser = getUsers.data.some((u) => u.email == userData.email)
      // console.log('storeReg',2)
      if(sameUser){
        // console.log('storeReg',2.1)
        set({ error:'пользователь с таким email уже существует', isLoading:false})
        // console.log('storeReg',2.2)
        return { success:false}
      }
      // console.log('storeReg',3)
      const { data: newUser } = await axios.post('/api/users', userData)
      // console.log('storeReg',4);
      
      if(!newUser?.token){
        set({error:'У вас отсутсвует токен',isLoading:false})
        return {success:false}
      }
      // console.log('storeReg',5);
      localStorage.setItem('user-token', newUser.token)
      set({ user: newUser, isLoading: false })
      return {success:true}
    }
    catch(error){
      // console.log('storeReg',9)
      const errorMessage = error.response?.data?.message || error.message || 'Ошибка регистрации'
      set({error:errorMessage,isLoading:false})
      // console.log('storeReg',10)
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
  
  }
}))

export default useAuthStore