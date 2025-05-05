"use client"
import React,{useEffect,useState} from 'react'
import useAuthStore from "@/src/store/AuthStore/authStore"
import { Button } from '@/src/ui/button'
import UserTickets from '../../../../app/profile/user tickets/page'
import UserDatas from '../../../../app/profile/user data/page'
import Support from '../../../../app/profile/support/page'
import ReturnTickets from '../../../../app/profile/return tickets/page'
import ProfileNatisfaction from '../../../../app/profile/natisfaction/page'
import Mods from '../../../../app/profile/mods/page'
import Languages from '../../../../app/profile/languages/page'
import Agreement from '../../../../app/profile/agreement/page'
import Link from 'next/link'
import { Skeleton } from '@/src/ui/skeleton'

const ProfilePageBuilder = () => {
    const {user,logout,isLoading } = useAuthStore()
    // console.log(user)
    const [tabs,setTabs] = useState(['','','','',''])
    const [tab,setTab] = useState('')
    const tabComponents = {
        'Пользовательское Соглашение': <Agreement/>,
        'Язык сайта': <Languages/>,
        'Темная / Светлая Тема': <Mods/>,
        'Уведомления': <ProfileNatisfaction/>,
        'Вернуть билеты': <ReturnTickets/>,
        'Поддержка': <Support/>,
        'Купленные Билеты': <UserTickets/>,
        'Данные Пользователя': <UserDatas/>,
    }
    useEffect(()=>{
        const updateTabs =()=>{
            if(user){
                setTabs([
                    'Пользовательское Соглашение', //
                    'Язык сайта', //
                    'Темная / Светлая Тема', //
                    'Уведомления',
                    'Вернуть билеты', //
                    'Поддержка', // 
                    'Купленные Билеты',
                    'Данные Пользователя',
                ])
            }
            else{
                setTabs([
                    'Пользовательское Соглашение', //
                    'Язык сайта', //
                    'Темная / Светлая Тема', //
                    'Вернуть билеты', //
                    'Поддержка', // 
                ])
            }
        }
        updateTabs()
    },[user])
    const AddCurrentTab = (tabName)=>{
        setTab(tabName)
    }
  return (
    <div className='my-[5rem] px-5'>
        <div className='flex gap-[6rem]'>
            <div className='space-y-[2rem] w-1/3'>
                <div className='text-3xl text-[#101828] leading-[129%] font-semibold'>
                    <h1>Профиль</h1>
                </div>
                <div className='shadow-lg p-[1rem] rounded-lg flex flex-col gap-7'>
                    <div className='flex flex-col gap-4'>
                        {!isLoading ? (
                            tabs.map((tab,index)=>(
                                <div className='' key={index}>
                                    <Button onClick={()=>AddCurrentTab(tab)} className='px-2 w-full justify-start bg-white h-[2.5rem] text-[#475467] shadow-none hover:bg-[#f6f8fa] text-lg'>
                                        {tab}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            tabs.map((item,index)=>(
                                <Skeleton key={index} className='w-full h-[2.5rem]'/>
                            ))
                        )}
                    </div>
                    <div className=''>
                        {user ? (
                            <Button className='w-full text-xl font-normal h-[2.5rem] rounded-xl bg-[#e30a13] hover:bg-black/70 cursor-pointer' onClick={logout}>
                                Выйти
                            </Button>
                            ) : (
                            <Link href='/login'>
                                <Button className='w-full text-xl font-normal h-[2.5rem] rounded-xl bg-[#e30a13] hover:bg-black/70 cursor-pointer'>
                                    Войти
                                </Button>
                            </Link>                     
                        )}          
                    </div>
                </div>
            </div>
            <div className='w-full'>
                {tab !== '' ? (
                    <div>{tabComponents[tab]}</div>
                    ) : (
                    <div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ProfilePageBuilder