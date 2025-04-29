import create from 'zustand';

export const useAuthStore = create((set)=>({
    user: null,
    isLoading: false,
    error: null,
    login: async(email,password)=>{
      set({isLoading:true,error:null})
      try{
        const response = await axios.get('/api/users')
        const user = response.data.find((u) => u.email == email && u.password == password)
        if(user){
          set({user, isLoading: false })
        }
        else{
          set({error: 'неверный email или пароль', isLoading: false })
        }
      }
      catch(error){
        set({error:'ошибка авторизации',isLoading:false} )
      }
    },
    register: async(userData)=>{
      set({isLoading:true,error:null })
      try {
        const response = await axios.post('/api/users', userData)
        set({ user: response.data, isLoading: false })
      }
      catch(error){
        set({error: 'ошибка регистрации',isLoading: false})
      }
    },
    logout:()=>{
      set({user:null})
    },
}))