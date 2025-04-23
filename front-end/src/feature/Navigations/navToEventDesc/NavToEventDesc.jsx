import React from 'react'
import { useRouter } from "next/navigation";
const NavToEventDesc = ({params}) => {
    const router = useRouter()
    const navigation = ()=>{
        router.push(`${params.id}/${id}`)
    }
}

export default NavToEventDesc