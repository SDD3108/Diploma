'use client'
import React,{useEffect,useState} from 'react'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AdminPageBuilder = () => {
    const router = useRouter()
    const { tokenUser } = GetToken()
    console.log(tokenUser);
    console.log(tokenUser.isAdmin);
    useEffect(()=>{
        if(!tokenUser || !tokenUser.isAdmin){
            toast('окак')
            toast('Ты не Админ')
            toast('это не для тебя')
            setTimeout(() => {
                // router.push('/')    
            }, 2000)
        }
    },[tokenUser])
  return (
    <div>
      AdminPageBuilder
    </div>
  )
}

export default AdminPageBuilder
