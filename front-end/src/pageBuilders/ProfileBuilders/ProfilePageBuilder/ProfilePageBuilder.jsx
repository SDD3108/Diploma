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
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { CheckDisplaySize } from '@/src/utils/CheckDisplaySize/CheckDisplaySize'
import { useRouter } from 'next/navigation'

const ProfilePageBuilder = () => {
    const router = useRouter()
    const { t } = useTranslation('common')
    const {logout,isLoading } = useAuthStore()
    const { tokenUser } = GetToken()
    const [tabs,setTabs] = useState(['','','','',''])
    const [tab,setTab] = useState('')
    const tabComponents = {
        [t("profile.tab.terms")]: <Agreement />,
        [t("profile.tab.language")]: <Languages />,
        [t("profile.tab.theme")]: <Mods />,
        [t("profile.tab.notifications")]: <ProfileNatisfaction />,
        [t("profile.tab.refund")]: <ReturnTickets />,
        [t("profile.tab.support")]: <Support />,
        [t("profile.tab.purchasedTickets")]: <UserTickets />,
        [t("profile.tab.userData")]: <UserDatas />,
    }
    useEffect(()=>{
        const updateTabs =()=>{
            if(tokenUser){
                setTabs([
                    t("profile.tab.terms"), //
                    t("profile.tab.language"), //
                    t("profile.tab.theme"), //
                    t("profile.tab.notifications"),
                    t("profile.tab.refund"), //
                    t("profile.tab.support"), // 
                    t("profile.tab.purchasedTickets"),
                    t("profile.tab.userData"),
                ])
            }
            else{
                setTabs([
                    t("profile.tab.terms"), //
                    t("profile.tab.language"), //
                    t("profile.tab.theme"), //
                    t("profile.tab.refund"), //
                    t("profile.tab.support"), // 
                ])
            }
        }
        updateTabs()
    },[tokenUser])
    const AddCurrentTab = (tabName)=>{
        setTab(tabName)
    }
  return (
    <div className='my-[5rem] px-5'>
        <div className='flex gap-[6rem]'>
            <div className='space-y-[2rem] w-1/3'>
                <div className='text-3xl text-[#101828] leading-[129%] font-semibold dark:text-white'>
                    <h1>{t('profile.page.title')}</h1>
                </div>
                <div className='shadow-lg p-[1rem] rounded-lg flex flex-col gap-7'>
                    <div className='flex flex-col gap-4'>
                        {!isLoading ? (
                            tabs.map((tab,index)=>(
                                <div className='' key={index}>
                                    <Button onClick={()=>AddCurrentTab(tab)} className='px-2 w-full justify-start bg-white h-[2.5rem] text-[#475467] shadow-none hover:bg-[#f6f8fa] text-lg dark:bg-black/60'>
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
                        {tokenUser ? (
                            <Button className='w-full text-xl font-normal h-[2.5rem] rounded-xl bg-[#e30a13] hover:bg-black/70 cursor-pointer dark:text-white' onClick={logout}>
                                {t('profile.button.logout')}
                            </Button>
                            ) : (
                            <Link href='/login'>
                                <Button className='w-full text-xl font-normal h-[2.5rem] rounded-xl bg-[#e30a13] hover:bg-black/70 cursor-pointer dark:text-white'>
                                    {t('profile.button.login')}
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
                    <></>
                )}
            </div>
        </div>
    </div>
  )
}

export default ProfilePageBuilder