import React, { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from '@/components/ui/button'
const EventCompanent = ({object,style}) => {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div className='w-full h-[20rem] rounded-xl cursor-pointer hover:scale-101 group'>
      <div className=''>
        {!imageError || !object ? (
          <Image src={object.image} alt='not found' onError={() => setImageError(true)} width={224} height={224} className='w-full h-[14rem] rounded-t-xl absolute top-0'/>
          ) : (
          <Skeleton className='w-full h-[14rem] rounded-t-xl absolute top-0'/>
        )}
      </div>
      <div className='p-2 flex flex-col w-full absolute bottom-6'>
        {object?.title ? (
          <Button variant="link" className='whitespace-normal break-words text-base mt-2 font-bold justify-normal p-0 cursor-pointer max-h-[1rem]'>
            {object.title}
          </Button>
          ) : (
          <Skeleton className='w-full h-[1rem] rounded-full mt-2'/>
        )}
        {object?.genre ? (
          <h3 className='mt-1.5 font-medium text-sm'>{object.genre}</h3>
          ) : (
          <Skeleton className='w-1/3 h-[1rem] rounded-full mt-1.5'/>
        )}
        
      </div>
    </div>
  
  )
}

export default EventCompanent