import React from 'react'
import { useRouter } from "next/navigation";
const NavToEvent = ({id}) => {
    const router = useRouter()
    router.push(`/events/${id}`)
}

export default NavToEvent