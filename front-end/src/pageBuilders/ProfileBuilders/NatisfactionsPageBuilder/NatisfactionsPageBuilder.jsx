"use client"
import React,{useState,useEffect} from 'react'
import { Checkbox } from "@/src/ui/checkbox"
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { Separator } from '@/src/ui/separator'
import ProfileNatisfactionMessage from '@/app/profile/natisfaction/[id]/page'
import { setData } from '@/src/utils/DataTransfer/DataTransfer'
import { secondGetData } from '@/src/utils/SecondDataTranser/SecondDataTranser'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from "@/src/ui/alert-dialog"
import axios from 'axios'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/src/ui/skeleton'
import { toast } from 'sonner'
import useAuthStore from '@/src/store/AuthStore/authStore'


const NatisfactionsPageBuilder = () => {
  const { t } = useTranslation('common')
  const { tokenUser } = GetToken()
  const { messages, deleteMessages } = useAuthStore()
  const [checkedAll, setCheckedAll] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [checkedItems, setCheckedItems] = useState([])
  useEffect(()=>{
    const closeMessagePage = secondGetData()
    setMessageOpen(closeMessagePage)
    setCheckedItems(Array(messages.length).fill(false))
    setCheckedAll(false)
  },[tokenUser?.messages])
  console.log(messages);
  
  const deleteSelectedMessages = async()=>{
    const selectedIds = messages.filter((_, index) => checkedItems[index]).map((message) => message._id)
    if(selectedIds.length == 0){
      toast(t('toast.deleteMessageSelect'))
      return
    }
    try{
      const resp = await deleteMessages(tokenUser._id,selectedIds)
      if(resp){
        toast(selectedIds.length > 1 ? t('notifications.deletedPlural') : t('notifications.deletedSingular'))
      }
      const newMessages = messages.filter((msg) => !selectedIds.includes(msg._id))
      setCheckedItems(Array(newMessages.length).fill(false))
      setCheckedAll(false)
    }
    catch(error){ 
      toast(error.response?.data?.message || 'Ошибка удаления')
      console.error('Ошибка', error.response?.data || error.message)
    }
  }
  const getDaysAgo = (dateString)=>{
    const [dayStr, monthStr, yearStr] = dateString.split(' ')
    const day = Number(dayStr)
    const month = Number(monthStr) -1
    const year = Number(yearStr)

    const date = new Date(year,month,day)
    const today = new Date()
    const diffTime = Math.abs(today - date)
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }
  const formatDaysAgo = (days)=>{
    if(days == 0){
      return 'сегодня'
    }
    if(days > 10 && days < 20){
      return `${days} дней назад`
    }
    if(days % 10 == 1){
      return `${days} день назад`
    }
    if(days % 10 > 1 && days % 10 < 5){
      return `${days} дня назад`
    }
    return `${days} дней назад`
  }
  const checkedAllBoxs = ()=>{
    const next = !checkedAll
    setCheckedAll(next)
    setCheckedItems(Array(messages.length).fill(next))
  }
  const ownChecked = (index)=>{
    const next = [...checkedItems]
    next[index] = !next[index]
    setCheckedItems(next)
    setCheckedAll(next.length == messages.length && next.every(Boolean))
  }
  const openMessagePage = (message)=>{
    setMessageOpen(true)
    setData(message)
    
  }
  return (
    <>
      {messageOpen ? (
        <>
          <ProfileNatisfactionMessage/>
        </>
      ) : (
        <div className='space-y-[2rem] md:mb-0 sm:mb-[2rem] max-sm:mb-[2rem]'>
          <div className='text-3xl text-[#101828] leading-[129%] font-semibold dark:text-white'>
            <h2>{t('notifications.heading')}</h2>
          </div>
          <div className='w-full flex flex-col shadow-lg min-h-[7.5rem] rounded-md dark:shadow-black'>
            <div className='flex justify-between w-full h-[3.5rem] bg-[#f6f8fa] rounded-t-md px-6 py-4 dark:bg-[#1A1A1A]'>
              <div className='flex items-center gap-2'>
                <Checkbox checked={checkedAll} onClick={checkedAllBoxs} />
                <h3 className='font-medium'>{t('notifications.selectAll')}</h3>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <h3 className='font-medium hover:underline cursor-pointer'>{t('notifications.delete')}</h3>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-white'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('notifications.confirm.title')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('notifications.confirm.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='cursor-pointer'>{t('notifications.confirm.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteSelectedMessages} className="bg-red-600 hover:bg-red-700 cursor-pointer">{t('notifications.confirm.action')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className='flex flex-col'>
              {messages.length == 0 ? (
                <div className='flex flex-col gap-2'>
                  <Skeleton className='w-full h-[4rem] bg-neutral-300 rounded-t-none'/>
                  <Skeleton className='w-full h-[4rem] bg-neutral-300 '/>
                  <Skeleton className='w-full h-[4rem] bg-neutral-300 '/>
                </div>
              ) : (
                messages.map((message,index)=>(
                  <div key={index}>
                    <div className='flex sm:flex-row max-sm:flex-col justify-between items-center sm:items-center max-sm:items-end pl-2 pr-[4rem] sm:pr-[4rem] max-sm:pr-4 py-1 min-h-[4rem]'>
                      <div className='flex items-center gap-[1.5rem] w-full'>
                        <div className='flex items-center gap-2'>
                          {!message.isRead ? (
                            <div className='w-2 h-2 rounded-full bg-[#0969da]'></div>
                          ) : (
                            <div className='w-2 h-2'></div>
                          )}
                          <Checkbox checked={checkedItems[index]} onClick={()=> ownChecked(index)} />
                        </div>
                        <div className='flex flex-col text-nowrap sm:text-nowrap max-sm:text-wrap w-full cursor-pointer' onClick={()=>openMessagePage(message)}>
                          <h3 className='font-medium'>{message.title}</h3>
                          <h4 className='text-sm font-normal'>{message.briefDescription}</h4>
                        </div>
                      </div>
                      <div className='flex text-nowrap'>
                        <h3>{formatDaysAgo(getDaysAgo(message.date))}</h3>
                      </div>
                    </div>
                    {index !== messages.length - 1 && (
                      <Separator key={index} className='w-full h-[1px] bg-[#e4e7ec] my-2' />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
    
  )
}

export default NatisfactionsPageBuilder