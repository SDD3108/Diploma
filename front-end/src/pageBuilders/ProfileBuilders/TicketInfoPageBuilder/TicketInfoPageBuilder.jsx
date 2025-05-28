"use client"
import React,{useState,useEffect} from 'react'
import { getData } from '@/src/utils/DataTransfer/DataTransfer'
import { GetSession } from '@/src/utils/GetSessions/GetSessions'
import { GetEvent } from '@/src/utils/GetEvents/GetEvents'
import { Skeleton } from '@/src/ui/skeleton'
import { Button } from '@/src/ui/button'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link'
import '@/i18n'
import { useTranslation } from 'react-i18next'
import { GetToken } from '@/src/utils/GetToken/GetToken'

const TicketInfoPageBuilder = () => {
    const { t } = useTranslation('common')
    const { tokenUser } = GetToken()
    const [sessionInfo,setSessionInfo] = useState(null)
    const [session,setSession] = useState(null)
    const [event,setEvent] = useState(null)
    const [imageError, setImageError] = useState(false)
    const eventId = sessionInfo?.eventId
    const sessionId = sessionInfo?.sessionId
    useEffect(()=>{
        const currentSession = getData()
        setSessionInfo(currentSession)
        
        const getSession = async() => {
            const session = await GetSession(currentSession.eventId,currentSession.sessionId)
            setSession(session)
        }
        const getEvent = async() => {
            const event = await GetEvent(currentSession.eventId)
            // console.log(event);
            setEvent(event)
        }
        
        getSession()
        getEvent()
    },[])
    const hallNumber = session?.hall?.replace(/\D/g, '')
    const getSortPlaces = ()=>{
        if(tokenUser?.purchasedTickets?.length == 0){
            return []
        }
        const places = tokenUser?.purchasedTickets?.filter((ticket) => ticket.eventId == eventId && ticket.sessionId == sessionId).flatMap((ticket) => ticket.ticketArray.map(t => t.place))
        return places?.sort((a,b)=>{
            const numA = parseInt(a.match(/\d+/g).join(''))
            const numB = parseInt(b.match(/\d+/g).join(''))
            return numB - numA
        })
    }
    const countTickets = ()=>{
        const ticketTypes = {
            VIP:{
                count: 0,
                text: t('event.vip'),
            },
            Adult:{
                count: 0,
                text: t('event.adult'),
            },
            Child:{
                count: 0,
                text: t('event.child'),
            }
        }
        if(!tokenUser?.purchasedTickets?.length || !sessionInfo){
            return []
        }
        tokenUser?.purchasedTickets?.filter(ticket => ticket.eventId == eventId && ticket.sessionId == sessionId).forEach((element)=>{
            element.ticketArray.forEach((element2)=>{
                if(ticketTypes[element2.ticketType]){
                    ticketTypes[element2.ticketType].count++
                }
            })
        })
        return Object.values(ticketTypes).filter((type) => type.count > 0)
    }
    const ticketCounts = countTickets()
    const places = getSortPlaces()
    const placesText = places?.join(', ')
  return (
    <div className='flex flex-col gap-4'>
        <div className='text-3xl text-[#101828] leading-[129%] font-semibold px-5'>
            <h2>{t('ticketDetails.title')}</h2>
        </div>
        <div className='flex flex-col shadow-md rounded-lg p-5 min-h-[20rem] bg-white'>
            <div className='grid grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 max-sm:grid-cols-1 gap-5'>
                <div className='w-full min-h-[30rem] rounded-lg shadow-md'>
                    <div>
                        {imageError ? (
                            <Skeleton className='w-full h-[15rem] rounded-lg rounded-b-none'/>
                        ) : (
                            <img onError={setImageError(true)} src={event?.image} alt='' className='w-full h-[15rem] rounded-lg rounded-b-none'/>
                        )}
                    </div>
                    <div className='flex flex-col gap-3 p-3.5'>
                        <div className='flex flex-col'>
                            {event ? (
                                <span className='text-lg font-semibold text-[#101828]'>{event.title}</span>
                            ) : (
                                <Skeleton className='w-[10rem] h-5 rounded-lg'/>
                            )}
                            {session ? (
                                <span className='text-sm text-[#475467] font-medium'>{session.sessionLocation} • {session.time}</span>
                            ) : (
                                <Skeleton className='w-[10rem] h-5 rounded-lg'/>
                            )}
                            <Link href={`/events/${event?._id}`}><Button variant='link' className='px-0 cursor-pointer justify-normal has-[>svg]:px-0'>{t('ticketDetails.link')}<ArrowRight /></Button></Link>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-sm font-medium text-[#475467]'>{t('ticketDetails.dateTime.label')}</span>
                            {!sessionInfo || !session || sessionInfo == null ? (
                                <div className='flex gap-4 w-1/2'>
                                    <Skeleton className='w-[10rem] h-5 rounded-lg'/>
                                    <Skeleton className='w-[10rem] h-5 rounded-lg'/>
                                </div>
                            ) : (
                                <span className='text-lg font-semibold text-[#101828]'>{sessionInfo.date} • {session.time} • <span className='border border-[#00F000] bg-[#00F000]/3 rounded-md px-3 py-1 text-sm text-[#00F000]'>{session.sessionLaunguage}</span></span>
                            )}
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex justify-between'>
                                <span className='text-sm font-medium'>{t('ticketDetails.hall.label')}</span>
                                <div className='border-b-[1px] w-full mx-1.5'></div>
                                <span className='text-sm font-medium text-[#475467]'>{hallNumber}</span>
                            </div>
                            {places?.length >= 2 ? (
                                <div className='flex flex-col justify-between'>
                                    <span className='text-sm font-medium'>{places?.length > 1 ? t('ticketDetails.places.many') : t('ticketDetails.places.single')}</span>
                                    <div></div>
                                    <span className='text-sm font-medium text-[#475467] border-b-[1px] w-full'>{placesText} {places?.length > 1 ? t('ticketDetails.places.many') : t('ticketDetails.places.single')}</span>
                                </div>
                                
                            ) : (
                                <div className='flex justify-between'>
                                    <span className='text-sm font-medium'>{places?.length > 1 ? t('ticketDetails.places.many') : t('ticketDetails.places.single')}</span>
                                    <div className='border-b-[1px] w-full'></div>
                                    <span className='text-sm font-medium text-[#475467] text-nowrap'>{placesText} {places?.length > 1 ? t('ticketDetails.places.many') : t('ticketDetails.places.single')}</span>
                                </div>
                            )}
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium text-[#475467]'>{t('ticketDetails.details.label')}</span>
                                <div className='flex flex-col gap-2'>
                                {ticketCounts.map(({text, count }, index) => (
                                    <div className='flex justify-between' key={`${text}-${index}`}>
                                        <span className='text-sm font-medium'>{text}</span>
                                        <div className='border-b-[1px] w-full mx-1.5'></div>
                                        <span className='text-sm font-medium text-[#475467]'>{count}</span>
                                    </div>
                                ))}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TicketInfoPageBuilder