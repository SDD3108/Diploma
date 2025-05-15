"use client"
import React,{useState,useEffect} from 'react'
import { Checkbox } from "@/src/ui/checkbox"
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { Separator } from '@/src/ui/separator'
import { useRouter } from 'next/navigation'
import ProfileNatisfactionMessage from '@/app/profile/natisfaction/[id]/page'
import { setData } from '@/src/utils/DataTransfer/DataTransfer'
import { secondGetData } from '@/src/utils/SecondDataTranser/SecondDataTranser'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/ui/alert-dialog"
import axios from 'axios'
import '@/i18n'
import { useTranslation } from 'react-i18next'

const NatisfactionsPageBuilder = () => {
  const { t } = useTranslation('common')
  const { tokenUser } = GetToken()
  const [checkedAll, setCheckedAll] = useState(false)
  const [messageOpen, setMessageOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      _id: 1,
      isRead: true,
      title: 'Уведомление',
      briefDescription: 'Ваше бронирование успешно подтверждено',
      description: 'Ваше бронирование успешно подтверждено. Вы можете просмотреть детали бронирования в вашем профиле.',
      date: '2025-10-01T10:00:00Z',
    },
    {
      _id: 2,
      isRead: true,
      title: 'Уведомление',
      briefDescription: 'Ваше бронирование успешно подтверждено',
      description: 'Ваше бронирование успешно подтверждено. Вы можете просмотреть детали бронирования в вашем профиле.',
      date: '2025-10-01T10:00:00Z',
    },
    {
      _id: 3,
      isRead: false,
      title: 'Уведомление',
      briefDescription: 'Ваше бронирование успешно подтверждено',
      description: 'Ваше бронирование успешно подтверждено. Вы можете просмотреть детали бронирования в вашем профиле.',
      date: '2025-10-01T10:00:00Z',
    }
  ])
  const [checkedItems, setCheckedItems] = useState(messages?.map(() => false))
  const router = useRouter()
  useEffect(()=>{
    const closeMessagePage = secondGetData()
    setMessageOpen(closeMessagePage)
    // setMessages(tokenUser.messages)
  },[])
  const deleteMessages = async ()=>{
    const selectedIds = messages.filter((_, index) => checkedItems[index]).map(message => message._id)

    if(selectedIds.length == 0){
      return
    }

    try{
      await Promise.all(selectedIds.map(id => 
        axios.delete(`/api/users/messages/${id}`)
      ))
      const newMessages = messages.filter((_, index) => !checkedItems[index])
      setMessages(newMessages)
      setCheckedItems(newMessages.map(() => false))
      setCheckedAll(false)
    }
    catch(error){
      console.log('ошибка при удалении',error)
    }

  }
  const getDaysAgo = (dateString)=>{
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - date)
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }
  const formatDaysAgo = (days)=>{
    if(days == 0){
      return 'сегодня'
    }
    const lastDigit = days % 10
    if(days > 10 && days < 20){
      return `${days} дней назад`
    }
    if(lastDigit == 1){
      return `${days} день назад`
    }
    if(lastDigit > 1 && lastDigit < 5){
      return `${days} дня назад`
    }
    return `${days} дней назад`
  }
  const checkedAllBoxs = ()=>{
    const newState = !checkedAll
    setCheckedAll(newState)
    setCheckedItems(messages.map(() => newState))
  }
  const ownChecked = (index)=>{
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = !newCheckedItems[index]
    setCheckedItems(newCheckedItems)
    const allChecked = newCheckedItems.every(Boolean)
    setCheckedAll(allChecked)
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
        <div className='space-y-[2rem]'>
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
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('notifications.confirm.title')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('notifications.confirm.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('notifications.confirm.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteMessages}className="bg-red-600 hover:bg-red-700">{t('notifications.confirm.action')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className='flex flex-col'>
              {messages?.map((message,index)=>(
                <div key={index}>
                  <div className='flex justify-between items-center pl-2 pr-[4rem] py-1 min-h-[4rem]'>
                    <div className='flex items-center gap-[1.5rem] w-full'>
                      <div className='flex items-center gap-2'>
                        {message.isRead ? (
                          <div className='w-2 h-2 rounded-full bg-[#0969da]'></div>
                        ) : (
                          <div className='w-2 h-2'></div>
                        )}
                        <Checkbox checked={checkedItems[index]} onClick={()=> ownChecked(index)} />
                      </div>
                      <div className='flex flex-col text-nowrap w-full cursor-pointer' onClick={()=>openMessagePage(message)}>
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
              ))}
            </div>
          </div>
        </div>
      )}
    </>
    
  )
}

export default NatisfactionsPageBuilder