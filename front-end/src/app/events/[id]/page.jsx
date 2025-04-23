"use client"
import React, { useEffect, useState, useMemo,useRef } from 'react'
import { use } from 'react'
import { useParams,useRouter } from "next/navigation";
import MyButton from '../../../companents/UI/button/MyButton';
import { Button } from "@/components/ui/button"
import HeaderCompanent from '@/src/companents/header/HeaderCompanent';
import FooterCompanent from '@/src/companents/footer/FooterCompanent';
import ErrorCompanent from "@/src/companents/error/ErrorCompanent"
import NotFoundCompanent from "@/src/companents/not found/NotFoundCompanent"
import axios from 'axios';
import Image from 'next/image'
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Skeleton } from "@/components/ui/skeleton"
// что тут происходит?
// 1. мы используем useParams чтобы получить id события из url
// 2. используем useRouter чтобы навигировать на страницу описания события
// 3. создаем функцию navigationToEventDescription которая принимает id события и переходит на страницу описания события
// 4. возвращаем разметку с заголовком события и кнопкой для перехода на страницу описания события
// как я могу улучшить код?
// 1. можно вынести логику навигации в отдельный хук
// 2. можно использовать useMemo для оптимизации производительности
// 3. можно использовать useCallback для оптимизации производительности
// еще можно использовать useEffect для выполнения побочных эффектов
// 4. можно использовать useReducer для управления состоянием
// // 5. можно использовать useContext для управления состоянием
// // 6. можно использовать useRef для получения ссылки на элемент

const Event = () => {
  const params = useParams()
  const router = useRouter()
  const firstButtonRef = useRef(null)
  const menuRef = useRef(null)
  const [event,setEvent] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const restoreFocus =()=>{
    const active = document.activeElement
    if(menuRef.current && !menuRef.current.contains(active)){
      firstButtonRef.current?.focus()
    }
  }
  useEffect(()=>{
    firstButtonRef.current.focus()
    restoreFocus()
    window.addEventListener("click",restoreFocus)
    window.addEventListener("focusin",restoreFocus)
    // return()=>{
    //   window.removeEventListener("click",restoreFocus)
    //   window.removeEventListener("focusin",restoreFocus)
    // }
  }, [])
  useEffect(()=>{
    console.log(event);
  },[event])
  useEffect(()=>{
    const getEvents = async ()=>{
      try{
        const resp = await axios.get('/api/events')
        setEvent(resp.data.find((event) => event._id == params.id))
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
  const sessions = [
    {
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
      sessions:[
        {
          id:Date.now(),
          time:'12:00',
          sessionLocation:'Кинотеатр "Арман"',
          hall:'Зал 2',
          isLanguage:true,
          sessionLaunguage:'Русский',
          isSubtitles:true,
          sessionSubtitles:'Казахский',
          isAdultPrice:true,
          adultPrice:5000,
          isChildPrice:true,
          childPrice:3000,
          isVIPPrice:true,
          vipPrice:10000,
        },
        {
          id:Date.now(),
          time:'12:10',
          sessionLocation:'Chaplin MEGA Silk Way',
          hall:'Зал 1',
          isLanguage:true,
          sessionLaunguage:'Кзх',
          isSubtitles:true,
          sessionSubtitles:'Рус',
          isAdultPrice:true,
          adultPrice:2200,
          isChildPrice:false,
          childPrice:null,
          isVIPPrice:true,
          vipPrice:5000,
        },
        {
          id:Date.now(),
          time:'12:15',
          sessionLocation:'Chaplin MEGA Silk Way',
          hall:'Зал 3',
          isLanguage:true,
          sessionLaunguage:'Кзх',
          isSubtitles:true,
          sessionSubtitles:'Рус',
          isAdultPrice:true,
          adultPrice:2200,
          isChildPrice:true,
          childPrice:1800,
          isVIPPrice:true,
          vipPrice:null,
        },
        {},
        {},
        {},
        {},
      ],
    },
    {},
    {},
]
  const navigationToEventDescription = (id)=>{
    router.push(`${params.id}/${id}`)
    // console.log(`${params.id}/${id}`);
    
  }
  if(error){
    return (
      <ErrorCompanent error={error}/>
    )
  }
  else if(!loading && !error && !event?._id){
    return (
      <NotFoundCompanent/>     
    )
  }
  return (
    <div className='flex flex-col gap-8 relative'>
      <HeaderCompanent/>
      <section className='flex md:flex-row sm:flex-col max-sm:flex-col gap-0 md:gap-8 sm:gap-5 max-sm:gap-5 px-5 w-full'>
        <div className='w-1/3 md:w-1/3 sm:w-full max-sm:w-full relative md:relative sm:absolute max-sm:absolute left-0'>
          <div className='sticky top-8'>
            <img src={event?.image} alt={event?.title} className='w-full h-auto md:h-auto sm:h-[24rem] max-sm:h-[24rem] object-cover rounded-xl md:rounded-xl sm:rounded-none max-sm:rounded-none'/>
            {/* как сделать эту картинку на всю длину экрана когда sm? */}
            {/* <Image src={event?.image} alt={event?.title} width={224} height={224} className='w-full h-auto md:h-auto sm:h-[24rem] object-cover rounded-xl md:rounded-xl sm:rounded-none'/> */}
            <div className='absolute top-4 right-4 bg-[#00F000] rounded-md w-1/5 md:w-1/5 sm:w-1/8 max-sm:w-1/8 flex justify-center items-center px-3 py-1'>
              <p className='text-white md:font-normal sm:font-bold max-sm:font-bold'>{event.age}+</p>
            </div>
          </div>  
        </div>
        <div className='w-full flex flex-col gap-8 mt-0 md:mt-0 sm:mt-[25rem] max-sm:mt-[25rem]'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='text-[#212121] text-4xl font-semibold'>{event.title}</h2>
            </div>
            <div className='w-1/8 sm:w-1/8 max-sm:w-1/4 rounded-md px-2 py-1 bg-black/10 flex justify-center items-center'>
              <h3 className='text-black/60 font-medium md:text-base sm:text-xs max-sm:text-xs uppercase'>{event.genre}</h3>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <NavigationMenu ref={menuRef}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Button ref={firstButtonRef} className='bg-white hover:bg-black/5 text-black/5 focus:text-black focus-visible:text-black'>
                    Item One
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button className='bg-white hover:bg-black/5 text-black/5 focus:text-black focus-visible:text-black'>
                      Item One
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button className='bg-white hover:bg-black/5 text-black/5 focus:text-black focus-visible:text-black'>
                      Item One
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> 
              <Separator className='mt-3 bg-[#3D3D3D]'/>
            </div>
            <div>
              <div className='flex justify-between items-center px-2 md:px-2 sm:px-4 max-sm:px-4'>
                <div>
                  <h2 className='font-medium text-black/60'>Время</h2>
                </div>
                <div className='flex gap-2 lg:gap-2 sm:gap-6 max-sm:gap-6 font-medium text-black/60 text-base lg:text-base md:text-xs sm:text-xs max-sm:text-xs'>
                  <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem]'>
                    <h2>Язык</h2>
                  </div>
                  <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem]'>
                    <h2>Взрослый</h2>
                  </div>
                  <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem]'>
                    <h2>Детский</h2>
                  </div>
                  <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem]'>
                    <h2>VIP</h2>
                  </div>
                </div>
              </div>
              <Separator className='mt-3 bg-[#3D3D3D]'/>
            </div>
            <div className='h-[48rem] flex flex-col gap-2'>
            {event?.sessions?.length == 0 ? (
              <>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
                <Skeleton className='h-[4rem]'/>
              </>
            ) : (
              event?.sessions?.map((session, index) => (
                <div key={index}>
                  <div className='h-[4rem] flex justify-between p-2 cursor-pointer' onClick={()=>navigationToEventDescription(session.id)}>
                    <div className='flex gap-3 w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 max-sm:w-1/2'>
                      <div className='w-1/4 rounded-md border border-[#00F000] bg-[#00F000]/3 flex justify-center items-center'>
                        <h3 className='font-bold text-lg text-[#00F000]'>{session.time}</h3>
                      </div>
                      <div className='flex flex-col'>
                        <h2 className=''> {session.sessionLocation} </h2>
                        <h3 className=''> {session.hall} </h3>
                      </div>
                    </div>
                    <div className='flex items-center gap-2 lg:gap-2 sm:gap-6 max-sm:gap-6 text-base lg:text-base md:text-sm '>
                      <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem] flex items-center'>
                        {session.isLanguage ? (
                          <div className=''>
                            <h3 className='font-medium text-black/60'>{session.sessionLaunguage}</h3>
                          </div>
                        ) : (
                          <div>
                            <h2 className='font-medium text-black/60'>–</h2>
                          </div>
                        )}
                      </div>
                      <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem] flex items-center'>
                        {session.isAdultPrice ? (
                          <div>
                            <h2 className='font-medium text-black/60'>{session.adultPrice} ₸</h2>
                          </div>
                        ) : (
                          <div>
                            <h2 className='font-medium text-black/60'>–</h2>
                          </div>
                        )}
                      </div>
                      <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem] flex items-center'>
                        {session.isChildPrice ? (
                          <div>
                            <h2 className='font-medium text-black/60'>{session.childPrice} ₸</h2>
                          </div>
                        ) : (
                          <div>
                            <h2 className='font-medium text-black/60'>–</h2>
                          </div>
                        )}
                      </div>
                      <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[3rem] flex items-center'>
                        {session.isVIPPrice ? (
                          <div>
                            <h2 className='font-medium text-black/60'>{session.vipPrice} ₸</h2>
                          </div>
                        ) : (
                          <div>
                            <h2 className='font-medium text-black/60'>–</h2>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index !== event?.sessions?.length - 1 && (
                    <Separator className='my-3 bg-[#3D3D3D]'/>
                  )}
                </div>
              ))
            )}
            
            </div>
          </div>
        </div>
      </section>
      <FooterCompanent/>
    </div>
  )
}


export default Event