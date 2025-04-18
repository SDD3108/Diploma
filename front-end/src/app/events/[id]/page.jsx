"use client"
import React from 'react'
import { useParams,useRouter } from "next/navigation";
import MyButton from '../../../companents/UI/button/MyButton';

const Event = ({params}) => {
    const router = useRouter()
    // const params = useParams();
    const navigationToEventDescription = (id)=>{
        router.push(`${params.id}/${id}`)
    }
  return (
    <div className='w-[64rem] lg:w-[64rem] max-sm:w-auto mx-auto flex flex-col justify-center'>
        <h2 className='text-center'>event {params.id}</h2>
        <MyButton className='w-[16rem] max-sm:w-1/3 mx-auto cursor-pointer' onClick={()=>{navigationToEventDescription(params.id+1)}} children='description'/>
    </div>
  )
}

export default Event