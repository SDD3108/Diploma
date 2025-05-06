import React,{useState,useEffect} from 'react'
import useAuthStore from "@/src/store/AuthStore/authStore"
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
export const GetToken = () => {
  const {user} = useAuthStore()
  const [tokenUser,setTokenUser] = useState({})
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    const setUser = async()=>{
      if(user){
        const decoded = jwtDecode(user)
        const response = await axios.get('/api/users')
        const currentUser = response.data.find((u) => u._id == decoded.userId)
        setTokenUser(currentUser)
        setLoading(false)
      }
      else{
        console.error('токен отсутствует')
        setLoading(false)
      }
    }
    setUser(user)
  },[user])
  return { tokenUser,loading }
}
// export GetToken