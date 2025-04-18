import React from 'react'
import Image from 'next/image'

const EventCompanent = ({object,style}) => {
  return (
    <div className='w-[14rem] h-[20rem] rounded-[1rem] cursor-pointer border border-black'>
      <div>
        <Image src={object.image} alt='not found' width={224} height={224} className='w-full h-[14rem] rounded-[1rem]'/>
      </div>
      <div className='p-2 flex flex-col gap-1'>
        <h2 className='whitespace-normal break-words'>{object.title}</h2>
        <h3 className=''>{object.genre}</h3>
      </div>
    </div>
  )
}

export default EventCompanent