"use client"
import React, { useEffect, useState, useMemo  } from 'react'
import { useRouter } from "next/navigation";
import EventItemPage from '@/app/(pages)/EventItemPage/page';
import axios from 'axios';
import { Card, CardContent } from "@/src/ui/card"
import { Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious, } from "@/src/ui/carousel"
import ErrorCompanent from "@/src/components/error/ErrorCompanent"
import NotFoundCompanent from "@/src/components/not-found/NotFoundCompanent"
// import NavToEvent from "@/src/fea`ture/Navigations/navToEvent/NavToEvent"
import { getData } from '@/src/utils/DataTransfer/DataTransfer';
import '@/i18n'
import { useTranslation } from 'react-i18next'


const EventsPageBuilder = () => {
    const { t } = useTranslation('common')
    const [events, setEvents] = useState([])
    const eventsTypes = [
        {
            engType:'movie',
            ruType:'Кино',
        },
        {
            engType:'theater',
            ruType:'Театры',
        },
        {
            engType:'concert',
            ruType:'Концерты',
        },
        {
            engType:'sport',
            ruType:'Спорт',  
        },
        {
            engType:'vacation',
            ruType:'Отдых',
        },
        {
            engType:'festival',
            ruType:'Фестиваль', 
        },
        {
            engType:'exhibition',
            ruType:'Выставки',
        },
        {
            engType:'workshop',
            ruType:'Семинары',
        },
    ]
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()  
    useEffect(()=>{
        const getEvents = async ()=>{
            try{
                const resp = await axios.get('/api/events')
                setEvents(resp.data)
            }
            catch(err){
                setError(err.resp?.data?.message || err.message || 'Unknown error')
            }
            finally{
                setLoading(false)
            }
        }
        getEvents()
        
    },[])
    const eventsByType = useMemo(() =>
        events.reduce((cash, event)=>{
            (cash[event.type] = cash[event.type] || []).push(event)
            return cash
        }, {}),[events]
    )
    const navigationToEvent = (id)=>{
        router.push(`events/${id}`)
    }
    const loadingEmptyArray = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]
    const obj = {
        id:1,
        type:'movie',
        rating:'9.1',
        isRating:true,
        age:16,
        genre:'action',
        image:'',
        title:'Фнаф 2',
        description:'На этот раз вселенная «Патруля» оказывается в области Абай',
        isDetails:true,
        details:{
            engTitle:'Fnaf 2',
            duration:'110',
            releaseDate:'31.08.2007',
            production:'Казахстан',
            director:'режиссер',
        },
        isRoles:true,
        roles:[
            'Рамазан Амантай',
            'Жақсылық Айтқұрман',
            'Жасұлан Айтенов',
            'Шарифбек Закиров',
            'Әльмахан Шахмардан',
            'Бақытгүл Серікбаева',
        ],
        reviews:[],
        isLocation:true,
        location:'Бар "skvôt."',
    }

    if(!loading && !error && events.length == 0){
        return (
            <NotFoundCompanent/>     
        )
    }
  return (
    <div className=''>
        {eventsTypes.slice(0,3).map((type,index)=>{
            const list = eventsByType[type.engType] || []
            return(
                <section className='px-5' key={index}>
                    <div className='w-full flex flex-col'>
                        <div>
                            <h2 className='text-3xl font-bold text-[#151515] dark:text-slate-100'>{t(`event.type.${type.engType}`)}</h2>
                        </div>
                        <Carousel className="w-full mt-4">
                            <CarouselContent className='w-full px-[1rem] gap-4'>
                                {loading ?
                                    loadingEmptyArray.map((emptyEvent, index2)=>(
                                        <CarouselItem key={index2} className="basis-[calc(100%/7)] xl:basis-[calc(100%/7)] lg:basis-[calc(100%/5)] md:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] max-sm:basis-[calc(100%/1.5)] p-0 py-2 hover:scale-101">
                                            <div className="p-0">
                                                <Card className="p-0 relative">
                                                    <CardContent className="flex aspect-square items-center justify-normal p-0">
                                                        <EventItemPage object={emptyEvent} loading={true} error={false}/>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))
                                    :
                                    error ? 
                                        loadingEmptyArray.map((emptyEvent, index1)=>(
                                            <CarouselItem key={index1} className="basis-[calc(100%/7)] xl:basis-[calc(100%/7)] lg:basis-[calc(100%/5)] md:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] max-sm:basis-[calc(100%/1.5)] p-0 py-2 hover:scale-101">
                                                <div className="p-0">
                                                    <Card className="p-0 relative">
                                                        <CardContent className="flex aspect-square items-center justify-normal p-0">
                                                            <EventItemPage object={emptyEvent} loading={false} error={true}/>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))
                                        : 
                                        list.map((event,index3)=>(
                                            <CarouselItem key={index3} onClick={()=>navigationToEvent(event._id)} className="basis-[calc(100%/7)] xl:basis-[calc(100%/7)] lg:basis-[calc(100%/5)] md:basis-[calc(100%/4)] sm:basis-[calc(100%/3)] max-sm:basis-[calc(100%/1.5)] p-0 py-2 hover:scale-101">
                                                <div className="p-0">
                                                    <Card className="p-0 relative">
                                                        <CardContent className="flex aspect-square items-center justify-normal p-0">
                                                            <EventItemPage object={event} loading={false} error={false}/>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))
                                    
                                }
                            </CarouselContent>
                            <CarouselPrevious className='w-[3rem] h-[3rem] disabled:hidden opacity-50 left-[3rem] '/>
                            <CarouselNext className='w-[3rem] h-[3rem] disabled:hidden opacity-50 right-[3rem]'/>
                        </Carousel>    
                    </div>        
                </section>
            )
        })}
    </div>
  )
}

export default EventsPageBuilder
