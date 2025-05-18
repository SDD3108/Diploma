"use client"
import React,{useState,useEffect} from 'react'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { Skeleton } from '@/src/ui/skeleton'
import Link from 'next/link'
import axios from 'axios'
import { Button } from '@/src/ui/button'
import TicketInfoPageBuilder from '@/app/profile/userTickets/ticketInfo/page'
import { setData } from '@/src/utils/DataTransfer/DataTransfer'
import { ArrowRight } from 'lucide-react';
import '@/i18n'
import { useTranslation } from 'react-i18next'

const UserTicketsPageBuilder = () => {
  const { t } = useTranslation('common')
  const { tokenUser,loading } = GetToken()
  const [events, setEvents] = useState([])
  const [sessions, setSessions] = useState([])
  const [imageError, setImageError] = useState(false)
  const [combinedTickets, setCombinedTickets] = useState([])
  const [TicketInfoPage, setTicketInfoPage] = useState(false)
// получаем eventId,пробигаемся циклом по events и ищем по eventId нужный нам объект
// потом выводим event.image и event.title

// по sessionId ищем нужный нам объект в sessions и выводим session.time,session.sessionLocation,session.hall
  const purchasedTickets = tokenUser?.purchasedTickets || []

  useEffect(() => {
    const getEventsAndSessions = async () => {
      const eventPromises = purchasedTickets.map((ticket) =>
        axios.get(`/api/events/${ticket.eventId}`)
      )
      const responses = await Promise.all(eventPromises)
      const combined = await Promise.all(purchasedTickets.map(async(ticket,index)=>{
        const eventResponse = responses[index]
        const event = eventResponse.data
        const session = event.sessions.find((s) => s._id == ticket._id)
        return { ...ticket, event, session }
      }))
      // console.log(combined);
      
      setCombinedTickets(combined)
      // console.log(foundSessions);
    }
    if(purchasedTickets.length > 0){
      getEventsAndSessions()
    }
    // getEventsAndSessions()
  }, [purchasedTickets])
  
  const test = (id)=>{
    console.log('Переданные данные в test:', id)
    setData(id)
    setTicketInfoPage(true)
  }

  return (
    <div>
      {TicketInfoPage ? (
        <TicketInfoPageBuilder/>
      ) : (
        <div className='flex flex-col gap-4 md:mx-0 sm:mx-auto max-sm:mx-auto md:my-0 sm:my-[1rem] max-sm:my-[1rem]'>
          <div className='text-3xl text-[#101828] leading-[129%] font-semibold px-5'>
            <h2>{t('profile.tickets.page.title')}</h2>
          </div>
          <div className='flex flex-col shadow-md md:shadow-md sm:shadow-none max-sm:shadow-none rounded-lg p-5 min-h-[20rem] bg-white'>
          <div className='w-full h-[2.5rem] flex justify-between items-center'>
            <span className='text-lg font-normal text-gray-800'>{t('profile.tickets.count.p1')} {tokenUser?.purchasedTickets?.length > 0 ? tokenUser?.purchasedTickets?.length : t('profile.tickets.count.p2')} {t('profile.tickets.count.p3')}</span>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          {loading ? (
              <>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
              </>
            ) : 
            combinedTickets.length > 0 ? (
              combinedTickets.map(({event,session,sessionId,eventId,date,ticketCount},index)=>(
                <div key={index} className='h-[14rem] flex rounded-lg shadow-md bg-white'>
                  <div className='relative'>
                    {imageError ? (
                      <Skeleton className='w-[10rem] h-[14rem] rounded-r-none'/>
                    ) : (
                      <img onError={() => setImageError(true)} src={event.image} alt='' className='w-[10rem] h-[14rem] object-cover rounded-l-lg'/>
                    )}
                    <div className='absolute top-2 right-0 w-[2.5rem] h-[1.5rem] bg-[#FBBF24] rounded-lg flex items-center justify-center rounded-r-none'>
                      <span className='text-sm text-white font-normal'>{event.age}+</span>
                    </div>
                  </div>
                  <div className='p-4 flex flex-col justify-between flex-1'>
                    <div>
                      <h3 className='text-xl font-semibold'>{event.title}</h3>
                      {session && (
                        <div>
                          <p className='text-gray-600 mt-2'>
                            {session.sessionLocation}
                          </p>
                          <p className='text-gray-600'>
                            {date} • {session.time}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button onClick={()=>test({eventId,sessionId,date,ticketCount})} variant="link" className='cursor-pointer has-[>svg]:px-0 px-0'> {t('profile.tickets.details')} <ArrowRight/></Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='mx-auto text-center py-[2rem] col-span-2'>
                <h2 className='text-xl text-gray-800'>{t('profile.tickets.empty.title')}</h2>
                <h3 className='text-lg text-gray-500'>{t('profile.tickets.empty.description.p1')} <br/> {t('profile.tickets.empty.description.p2')}</h3>
              </div>
            )}
          </div>
          </div>
        </div>
      )}
      
    </div>
  )
}

export default UserTicketsPageBuilder