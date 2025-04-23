import React from 'react'
import { useRouter } from "next/navigation";
const NavToProfile = () => {
    const router = useRouter()
    const navigation = ()=>{
        router.push('/profile')
    }
}

export default NavToProfile