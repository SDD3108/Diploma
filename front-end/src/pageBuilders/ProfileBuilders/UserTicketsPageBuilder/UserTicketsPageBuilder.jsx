import React,{useState,useEffect} from 'react'
import {GetToken} from '@/src/utils/GetToken/GetToken'
import { Skeleton } from '@/src/ui/skeleton'
import Link from 'next/link'
import axios from 'axios'

const UserTicketsPageBuilder = () => {
  const { tokenUser,loading } = GetToken()
  const [events, setEvents] = useState([])
  const [sessions, setSessions] = useState([])
  const [imageError, setImageError] = useState(false)
// получаем eventId,пробигаемся циклом по events и ищем по eventId нужный нам объект
// потом выводим event.image и event.title



// по sessionId ищем нужный нам объект в sessions и выводим session.time,session.sessionLocation,session.hall
  const [purchasedTickets, setPurchasedTickets] = useState([
    {
      eventId: '68080a3e83708e68cc159f80',
      ticketId: '68080a3e83708e68cc159f81',
      ticketPrice: 2000,
      ticketCount: 2,
    },
    {
      eventId: '6809069c21382f101ee29d92',
      ticketId: '6809069c21382f101ee29d93',
      ticketPrice: 1500,
      ticketCount: 1,
    },
    {
      eventId: '680b387b4e6dced72b38423e',
      ticketId: '680b387b4e6dced72b38423f',
      ticketPrice: 2000,
      ticketCount: 3,
    },
  ])

  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventPromises = purchasedTickets.map((ticket) =>
          axios.get(`/api/events/${ticket.eventId}`)
        )
        const responses = await Promise.all(eventPromises)
        const eventsData = responses.map((res) => res.data)
        const sessionsData = responses.map((res) => res.data.sessions)
        setEvents(eventsData)

        const allSessions = eventsData.flatMap(event => event.sessions || [])
        const foundSessions = purchasedTickets.map((ticket) =>
          allSessions.find(session => session._id == ticket.ticketId)
        ).filter(Boolean)
        setSessions(foundSessions)

      }
      catch(error){
        console.error('Ошибка при загрузке событий:', error)
      }
    }
    getEvents()
  }, [])
  
  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='text-3xl text-[#101828] leading-[129%] font-semibold'>
          <h2>Мои Билеты</h2>
        </div>
        <div className='flex flex-col shadow-md rounded-lg p-5 min-h-[20rem] bg-white'>
          <div className='w-full h-[2.5rem] flex justify-between items-center'>
            <span className='text-lg font-normal text-gray-800'>У вас {tokenUser?.purchasedTickets?.length > 0 ? tokenUser?.purchasedTickets?.length : 0} Приобретенных билетов</span>
            <span className='text-lg font-normal text-gray-800'></span>
          </div>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            {loading ? (
              <>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
                <Skeleton className='w-full h-[14rem] rounded-lg'/>
              </>
            ) : (
              tokenUser ? (
                    events.map((event,index2) => (
                      <div key={index2} className='h-[14rem] flex rounded-lg shadow-md bg-white'>
                        <div className='relative'>
                          {imageError ? (
                            <Skeleton className='w-[10rem] h-[14rem] rounded-r-none'/>
                          ) : (
                            <img onError={setImageError(true)} src={event.image} alt={event.title} className='w-[10rem] h-[14rem] object-cover rounded-l-lg' />
                          )}
                          <div className='absolute top-2 right-0 w-[2.5rem] h-[1.5rem] bg-[#FBBF24] rounded-lg flex items-center justify-center rounded-r-none'>
                            <span className='text-sm text-white font-normal'>{event.age}+</span>
                          </div>
                        </div>
                        <div>
                        {purchasedTickets.map((ticket) => {

                          const event = events.find((e) => e._id == ticket.eventId)
                          const session = sessions.find((s) => s._id == ticket.ticketId)
                          if(!event || !session){
                            return null
                          }
                          return (
                            <div key={ticket.ticketId} className="ticket-card">
                              <img src={event.image} alt={event.title} onError={() => setImageError(true)}/>
                              <p>Время: {session.time}</p>    
                            </div>
                          ) 
                        })}
                        </div>
                      </div>
                    ))

                ) : (
                  <div className='mx-auto text-center py-[2rem]'>
                  <h2 className='text-xl text-gray-800'>У вас нет купленных билетов</h2>
                  <h3 className='text-lg text-gray-500'>В этом разделе будут отображаться <br/> купленные билеты</h3>
                </div>
                )
            
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTicketsPageBuilder