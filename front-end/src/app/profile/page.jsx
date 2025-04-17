import React from 'react'

import Languages from './languages/page'
import Mods from './mods/page'
import Support from './support/page'
import ReturnTickets from './return tickets/page'
import Agreement from './agreement/page'

import UserDatas from './user data/page'
import UserTickets from './user tickets/page'
import Natisfaction from '../natisfaction/page'

import MyButton from '../../companents/UI/button/MyButton'

import ProfileCard from '../../companents/UI/profile card/profileCard'

const Profile = () => {
    const arr = [
        {
            id:1,
            name:'name 1',
            desc:'desc 1',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:2,
            name:'name 2',
            desc:'desc 2',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:3,
            name:'name 3',
            desc:'desc 3',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:4,
            name:'name 4',
            desc:'desc 4',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:5,
            name:'name 5',
            desc:'desc 5',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:6,
            name:'name 6',
            desc:'desc 6',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:7,
            name:'name 7',
            desc:'desc 7',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
        {
            id:8,
            name:'name 8',
            desc:'desc 8',
            source:'https://images.thevoicemag.ru/upload/img_cache/d13/d1382d1565ddc1268b48a6281e8df8f3_cropped_365x550.jpg',
        },
    ]
  return (
    <>
        <div>
            <div>Profile</div>
            <div>
                <UserDatas/>
                <UserTickets/>
                <Natisfaction/>
            </div>
            <div>
                <Languages/>
                <Mods/>
                <Support/>
                <ReturnTickets/>
                <Agreement/>
            </div>
        </div>
        <div className='grid grid-cols-2 grid-rows-3 gap-[1rem] px-[1.5rem] w-1/2'>
            {arr.map((card,index)=>(
                <ProfileCard key={index} title={card.name} description={card.desc} source={card.source}  />
            ))}
        </div>
    </>
    
  )
}

export default Profile