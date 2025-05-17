"use client"
import React,{useState} from "react"
import useAuthStore from "../../../src/store/AuthStore/authStore"
import axios from "axios"
import { Input } from "@/src/ui/input"

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const { user } = useAuthStore()
  
    const handleSubmit = async() => {
      await axios.patch(`/api/users/${user._id}`, {
        password:newPassword,
        tempPassword:null,
      })
      localStorage.removeItem('force-password-change')
      router.push('/profile')
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <Input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button>Сменить пароль</button>
      </form>
    )
}
export default ChangePassword