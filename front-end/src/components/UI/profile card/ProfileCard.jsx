import React from 'react'
import Image from 'next/image';

const ProfileCard = ({style,title,description,source,...props}) => {
  return (
    <div className='w-full h-[8rem] rounded-[1rem] flex gap-[1rem] border border-black p-[1.5rem]' {...props}>
        <div>
            <Image
                src={source}
                alt='not found'
                width={52}
                height={80}
            />
        </div>
        <div className='flex flex-col'>
            <h2>{title}</h2>
            <h3>{description}</h3>
        </div>
    </div>
  )
}

export default ProfileCard