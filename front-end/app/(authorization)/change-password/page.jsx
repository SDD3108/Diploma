"use client"
import React,{useState} from "react"
import useAuthStore from "../../../src/store/AuthStore/authStore"
import axios from "axios"
import { Input } from "@/src/ui/input"
import { Button } from "@/src/ui/button"

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const { user } = useAuthStore()
  
    const handleSubmit = async() => {
      await axios.patch(`/api/users/${user._id}`,{
        password:newPassword,
        tempPassword:null,
      })
      localStorage.removeItem('force-password-change')
      router.push('/profile')
    }
    return (
      <div className="px-5">
        <form onSubmit={handleSubmit}>
            <div className="w-1/3 mx-auto space-y-4 py-12">
                <span>Введите свой новый пароль</span>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <Button>Сменить пароль</Button>
            </div>
            
        </form>
      </div>
    )
}
export default ChangePassword