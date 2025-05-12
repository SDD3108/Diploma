"use client"
import React from 'react'
import useAuthStore from "@/src/store/AuthStore/authStore"
import NatisfactionsPageBuilder from "@/src/pageBuilders/ProfileBuilders/NatisfactionsPageBuilder/NatisfactionsPageBuilder"

const ProfileNatisfaction = () => {
  const user = useAuthStore((state) => state.user)
  // console.log(user);
  
  return (
    <div className='px-5'>

      <NatisfactionsPageBuilder/>
      
    </div>
  )
}

export default ProfileNatisfaction