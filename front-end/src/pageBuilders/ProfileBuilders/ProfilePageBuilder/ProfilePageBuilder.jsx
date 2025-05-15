"use client"
import React,{useEffect,useState} from 'react'
import useAuthStore from "@/src/store/AuthStore/authStore"
import { Button } from '@/src/ui/button'
import UserTickets from '../../../../app/profile/userTickets/page'
import UserDatas from '../../../../app/profile/userData/page'
import Support from '../../../../app/profile/support/page'
import ReturnTickets from '../../../../app/profile/return/page'
import ProfileNatisfaction from '../../../../app/profile/natisfaction/page'
import Mods from '../../../../app/profile/mods/page'
import Languages from '../../../../app/profile/languages/page'
import Agreement from '@/app/profile/agreement/page'
import Link from 'next/link'
import { Skeleton } from '@/src/ui/skeleton'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { CheckDisplaySize } from '@/src/utils/CheckDisplaySize/CheckDisplaySize'
import { useRouter } from 'next/navigation'

const ProfilePageBuilder = () => {
    const { t } = useTranslation('common')
    const {logout,isLoading } = useAuthStore()
    const { tokenUser } = GetToken()
    const [tabs,setTabs] = useState(['','','','',''])
    const [tab,setTab] = useState(null)
    const router = useRouter()
    const isMobile = CheckDisplaySize(768)

    const tabsComponents = [
        {
            text:t("profile.tab.terms"),
            component:<Agreement />,
            link:'/profile/agreement',
        },
        {
            text:t("profile.tab.language"),
            component:<Languages />,
            link:'/profile/languages',
        },
        {
            text:t("profile.tab.theme"),
            component:<Mods />,
            link:'/profile/mods',
        },
        {
            text:t("profile.tab.notifications"),
            component:<ProfileNatisfaction />,
            link:'/profile/natisfaction',
        },
        {
            text:t("profile.tab.refund"),
            component:<ReturnTickets />,
            link:'/profile/return',
        },
        {
            text:t("profile.tab.support"),
            component:<Support />,
            link:'/profile/support',
        },
        {
            text:t("profile.tab.purchasedTickets"),
            component:<UserTickets />,
            link:'/profile/userTickets',
        },
        {
            text:t("profile.tab.userData"),
            component:<UserDatas />,
            link:'/profile/userData',
        },
    ]
    const checkVisibleTabs = tokenUser ? tabsComponents : tabsComponents.filter((tab) => ![t('profile.tab.purchasedTickets'), t('profile.tab.userData')].includes(tab.text))
    const AddCurrentTab = (tab)=>{
        if(isMobile){
            router.push(tab.link)
        }
        else{
            setTab(tab)
        }
    }
  return (
    <div className='my-[5rem] px-5'>
        <div className='flex gap-[6rem]'>
            <div className='space-y-[2rem] w-1/3 md:w-1/3 sm:w-full max-sm:w-full'>
                <div className='text-3xl text-[#101828] leading-[129%] font-semibold dark:text-white'>
                    <h1>{t('profile.page.title')}</h1>
                </div>
                <div className='shadow-lg p-[1rem] rounded-lg flex flex-col gap-7'>
                    <div className='flex flex-col gap-4'>
                        {!isLoading ? (
                            checkVisibleTabs.map((tab,index)=>(
                                <div className='' key={index}>
                                    <Button onClick={()=>AddCurrentTab(tab)} className='px-2 w-full justify-start bg-white h-[2.5rem] text-[#475467] shadow-none hover:bg-[#f6f8fa] text-lg dark:bg-black/60 md:text-lg sm:text-md max-sm:text-sm'>
                                        {tab.text}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            checkVisibleTabs.map((item,index)=>(
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
            <div className='w-full block md:block sm:hidden max-sm:hidden'>
                {!isMobile && tab ? (
                    <div>{tab.component}</div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    </div>
  )
}

export default ProfilePageBuilder