import React from 'react'
import { useRouter } from "next/navigation";
const NavToHome = () => {
    const router = useRouter()
    const navigation = ()=>{
        router.push('/')
    }
}

export default NavToHome