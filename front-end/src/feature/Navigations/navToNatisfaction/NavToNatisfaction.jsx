import React from 'react'
import { useRouter } from "next/navigation";
const NavToNatisfaction = () => {
    const router = useRouter()
    const navigation = ()=>{
        router.push('/natisfaction')
    }
}

export default NavToNatisfaction