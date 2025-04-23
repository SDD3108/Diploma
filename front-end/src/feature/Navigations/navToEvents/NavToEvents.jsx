import React from 'react'
import { useRouter } from "next/navigation";
const NavToEvents = () => {
    const router = useRouter()
    const navigation = ()=>{
        router.push('/events')
    }
}

export default NavToEvents