import React from 'react'
import Image from 'next/image'

const EventCompanent = ({object,style}) => {
  return (
    <div className='w-[14rem] h-[20rem] rounded-[1rem] cursor-pointer border border-black'>
      <div>
        <Image src={object.image} alt='not found' width={224} height={224} className='w-full h-[14rem] rounded-[1rem]'/>
      </div>
      <div className='px-2 py-3 flex flex-col gap-1'>
        <h2 className=''>name: {object.name}</h2>
        <h3 className=''>desc: {object.desc}</h3>
      </div>
    </div>
  )
}

export default EventCompanent