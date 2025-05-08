import React, { useState } from 'react'
import Image from 'next/image'
import { Skeleton } from "@/src/ui/skeleton"
import { Button } from '@/src/ui/button'
const EventItemPageBuilder = ({object,loading,error}) => {
  const [imageError, setImageError] = useState(false)
  // console.log('object',object);
  
  return (
    <div className='w-full h-[20rem] rounded-xl cursor-pointer group '>
      <div className=''>
        {loading || error || imageError || !object?.image ? (
          <Skeleton className='w-full h-[14rem] rounded-t-xl absolute top-0'/>
          ) : (
          <Image src={object?.image} alt='not found' onError={() => setImageError(true)} width={224} height={224} className='w-full h-[14rem] rounded-t-xl absolute top-0'/>
        )}
      </div>
      <div className='p-2 flex flex-col w-full absolute bottom-6'>
        {loading || error ? (
          <Skeleton className='w-full h-[1rem] rounded-full mt-2'/>
          ) : (
          <Button variant="link" className='whitespace-normal break-words text-sm mt-2 font-bold justify-normal p-0 cursor-pointer max-h-[1rem] text-nowrap'>
            {object?.title}
          </Button>

        )}
        {loading || error ? (
          <Skeleton className='w-1/3 h-[1rem] rounded-full mt-1.5'/>
          
          ) : (
          <h3 className='mt-1.5 font-medium text-sm'>{object?.genre}</h3>
        )}
        
      </div>
    </div>
  
  )
}

export default EventItemPageBuilder