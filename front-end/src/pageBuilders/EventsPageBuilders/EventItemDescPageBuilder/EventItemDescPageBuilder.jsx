"use client"
import React, { useEffect, useState, useMemo,useRef } from 'react'
import { useParams,useRouter } from "next/navigation";
import { Button } from "@/src/ui/button"
import ErrorCompanent from "@/src/components/error/ErrorCompanent"
import NotFoundCompanent from "@/src/components/not found/NotFoundCompanent"
import axios from 'axios';
import Image from 'next/image'
import { Separator } from "@/src/ui/separator";
import { NavigationMenu,NavigationMenuItem,NavigationMenuList } from "@/src/ui/navigation-menu"
import { Skeleton } from "@/src/ui/skeleton"
import Link from 'next/link';
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { Textarea } from "@/src/ui/textarea"
import { Avatar,AvatarFallback, AvatarImage } from '@/src/ui/avatar';
import { toast } from "sonner"
import { GetInitials } from '@/src/utils/GetInitials/GetInitials'
import '@/i18n'
import { useTranslation } from 'react-i18next'

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

const EventItemDescPageBuilder = () => {
  const { t } = useTranslation('common')
  const { tokenUser,loading } = GetToken()
  const params = useParams()
  const router = useRouter()
  const firstButtonRef = useRef(null)
  const menuRef = useRef(null)
  const [event,setEvent] = useState({})
  const [loadingg, setLoadingg] = useState(true)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [activeTab, setActiveTab] = useState('tickets')
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users, setUsers] = useState([])
  useEffect(()=>{
    const getEvents = async ()=>{
      try{
        const resp = await axios.get('/api/events')
        const data = resp.data.find((event) => event._id == params.id)
        setEvent(data)
      }
      catch(err){
        setError(err.resp?.data?.message || err.message || 'Unknown error')
      }
      finally{
        setLoadingg(false)
      }
    }
    const getUsers = async ()=>{
      try{
        const resp = await axios.get('/api/users')
        setUsers(resp.data)
      }
      catch(err){
        setError(err.resp?.data?.message || err.message || 'Unknown error')
      }
      finally{
        setLoadingg(false)
      }
    }
    getEvents()
    getUsers()
  },[])
  const tabsPageLogic = [
  {
    title:t('event.description'),
    key: 'description',
    condition: true,
    render: (value) => <h3 className='text-gray-500'>{value}</h3>,
  },
  {
    title:t('event.roles'),
    key:'roles',
    condition:event.isRoles,
    render: (value) => Array.isArray(value) ? value.join(', ') : value
  },
  {
    title:t('event.details'),
    key:'details',
    condition:event.isDetails,
    render: (value) => {
      const labelMap = {
        engTitle:t('event.details.movie'),
        duration:t('event.details.duration'),
        releaseDate:t('event.details.releaseDate'),
        production:t('event.details.production'),
        director:t('event.details.director'),
      }
      return (
        <ul className='flex flex-col gap-1'>
          {Object.entries(value).filter(([key]) => labelMap[key]).map(([key, val]) => (
            <li key={key} className='flex'>
              {/* {console.log(labelMap[key])} */}
              <span className='text-[#151515] font-medium text-nowrap dark:text-slate-100/50'>{labelMap[key]}</span>
              <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              <span className='font-medium text-nowrap'>{key == 'duration' && typeof val == 'number' ? ` ${val} ${t('event.details.minute')}` : ` ${val || t('event.details.notSpecified')}`}</span>
            </li>
          ))}
        </ul>
      )
    }
  },
  {
    title:'',
    key:'',
    condition:false
  },
  ]
  const ratingArray = [1,2,3,4,5]
  const TicketsContent = useMemo(()=> ()=>(
  <div>
    <div>
      <div className='flex sm:flex-row max-sm:flex-col justify-between items-center sm:items-center max-sm:items-end px-2 md:px-2 sm:px-4 max-sm:px-2'>
        <div>
          <h2 className='font-medium text-black/60 dark:text-slate-100 text-left'>{t('event.time')}</h2>
        </div>
        <div className='flex sm:justify-end gap-2 lg:gap-2 sm:gap-9 max-sm:gap-9 font-medium text-black/60 dark:text-slate-100 text-base lg:text-base md:text-xs sm:text-base max-sm:text-sm'>
          <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem]'>
            <h2>{t('event.language')}</h2>
          </div>
          <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem]'>
            <h2>{t('event.adult')}</h2>
          </div>
          <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem]'>
            <h2>{t('event.child')}</h2>
          </div>
          <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem]'>
            <h2>{t('event.vip')}</h2>
          </div>
        </div>
      </div>
      <Separator className='mt-3 bg-[#3D3D3D]'/>
    </div>
    <div className='h-[48rem] flex flex-col'>
      {event?.sessions?.length == 0 ? (
        <div className='mt-3 flex flex-col gap-2'>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
          <Skeleton className='h-[4rem]'/>
        </div>
      ) : (
        event?.sessions?.map((session, index) => (
          <div key={index}>
            <Link href={`/events/${params.id}/${session._id}`} className='w-full'>
            <div className='h-[4rem] md:h-[4rem] sm:h-[6rem] max-sm:h-[6rem] flex justify-between md:flex-row sm:flex-col max-sm:flex-col p-2 cursor-pointer'>
              <div className='flex gap-3 w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 max-sm:w-full'>
                <div className='w-1/4 rounded-md border border-[#00F000] bg-[#00F000]/3 flex justify-center items-center'>
                  <h3 className='font-bold text-lg text-[#00F000]'>{session.time}</h3>
                </div>
                <div className='flex flex-col'>
                  <h2 className='sm:text-base max-sm:text-xs'> {session.sessionLocation} </h2>
                  <h3 className='sm:text-base max-sm:text-xs'> {session.hall} </h3>
                </div>
              </div>
              <div className='flex items-center md:items-center sm:items-end md:justify-normal sm:justify-end max-sm:justify-end gap-2 xl:gap-2 lg:gap-1.5 md:gap-2 sm:gap-9 max-sm:gap-9 text-base lg:text-base md:text-sm sm:text-base max-sm:text-sm '>
                <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem] flex items-center'>
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
                <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem] flex items-center'>
                  {session.isAdultPrice ? (
                    <div>
                      <h2 className='font-medium text-black/60 text-nowrap'>{session.adultPrice} ₸</h2>
                    </div>
                  ) : (
                    <div>
                      <h2 className='font-medium text-black/60 text-nowrap'>–</h2>
                    </div>
                  )}
                </div>
                <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem] flex items-center text-nowrap'>
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
                <div className='w-[5.5rem] lg:w-[5.5rem] md:w-[3.5rem] sm:w-[3rem] max-sm:w-[2.6rem] flex items-center text-nowrap'>
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
            </Link>
            {index !== event?.sessions?.length - 1 && (
              <Separator className='my-3 bg-neutral-300'/>
            )}
          </div>
        ))
      )}
    </div>
  </div>
  ),[event?.sessions,params.id,t])
  const AboutContent = useMemo(()=> ()=>(
  <div className='w-full'>
    <div className='grid grid-cols-2 sm:grid-cols-2 max-sm:grid-cols-1 grid-rows-2 gap-x-8 gap-y-4'>
      {tabsPageLogic.map(({title,key,condition,render},index)=>(
        <div key={index} className={`w-full min-h-[9rem] flex flex-col ${!condition && 'hidden'}`}>
          {title && (
            <div>
              <h2 className='font-bold mb-2'>{title}</h2>
            </div>
          )}
          <div className='text-gray-500'>
            {event[key] && event[key] && render(event[key])}
          </div>
        </div>
      ))}
    </div>
  </div>
  ),[event,t])
  const ReviewsContent = useMemo(()=> ()=>{
    const handleSubmitReview = async () => {
    if(!rating || !reviewText.trim()){
      toast(t('event.reviews.fillFields'))
      return
    }
    else if(!rating){
      toast(t('event.reviews.addRating'))
      return
    }
    else if(!reviewText.trim()){
      toast(t('event.reviews.addText'))
      return
    }
    setIsSubmitting(true)
    try{
      const newEventReview = {
        userId: tokenUser?._id,
        text: reviewText,
        grade: rating,
      }
      const newUserReview = {
        eventId: params.id,
        text: reviewText,
        grade: rating,
      }
      const resp = await axios.post(`/api/events/${params.id}/reviews`,newEventReview)
      const userResp = await axios.post(`/api/users/${tokenUser?._id}/reviews`,newUserReview)
      setEvent(prev => ({...prev,reviews: [...(prev.reviews || []), newEventReview]}))

      toast(t('event.reviews.success'))
      setReviewText('')
      setRating(0)
    }
    catch(error){
      toast(t('event.reviews.error'))
      // console.log(error);
      
    }
    finally{
      setIsSubmitting(false)
    }
    }
    const renderStars =(currentRating,isInteractive = true)=>{
    return (
      <div className="flex gap-1">
        {ratingArray.map((star)=>(
          <button key={star} type="button" disabled={!isInteractive} onClick={() => isInteractive && setRating(star)} className={`text-2xl ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </button>
        ))}
      </div>
    )
    }  
    if(!event.isReviews){
      return (
        <div className="text-gray-500">{t('event.reviews.disabled')}</div>
      )
    }
    return (
      <div className="space-y-8">
        {tokenUser && (
          <div className="border p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold">{t('event.reviews.leaveReview')}</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('event.reviews.rating')}</label>
              {renderStars(rating)}
            </div>

            <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={t('event.reviews.placeholder')} className="min-h-[120px]"/>

            <Button onClick={handleSubmitReview} disabled={isSubmitting} className='dark:bg-neutral-900 dark:text-slate-100'>
              {isSubmitting ? t('event.reviews.submitting') : t('event.reviews.submit')}
            </Button>
          </div>
        )}
        <div className="space-y-4">
          {event.reviews?.length > 0 ? (
            event.reviews.map((review,index)=>{
              const user = users.find((u) => u._id == review.userId)
              return (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className='flex gap-2 items-center'>
                      <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{GetInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{user?.name || t('event.reviews.username')}</p> 
                    </div>
                    {renderStars(review.grade,false)}
                  </div>
                  <p className="text-gray-600">{review.text}</p>
              </div>
              )

            })
          ) : (
            <p className="text-gray-500">{t('event.reviews.noReviews')}</p>
          )}
        </div>
      </div>
    )
  },[event,users,tokenUser,rating,reviewText,t])
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
    <div className='flex flex-col gap-8 relative my-20'>
      <section className='flex md:flex-row sm:flex-col max-sm:flex-col gap-0 md:gap-8 sm:gap-5 max-sm:gap-5 px-5 w-full'>
        <div className='w-1/3 md:w-1/3 sm:w-full max-sm:w-full relative md:relative sm:absolute max-sm:absolute left-0'>
          <div className='sticky top-8'>
            {loading || imageError || !event?.image ? (
              <Skeleton className='w-full h-[28rem] md:h-[28rem] sm:h-[24rem] max-sm:h-[24rem] object-cover rounded-xl md:rounded-xl sm:rounded-none max-sm:rounded-none'/>
            ) : (
              <img src={event?.image} alt={event?.title} onError={()=> setImageError(true)} className='w-full h-auto md:h-auto sm:h-[24rem] max-sm:h-[24rem] object-cover rounded-xl md:rounded-xl sm:rounded-none max-sm:rounded-none'/>
            )}
            <div className='absolute top-4 right-4 bg-[#00F000] rounded-md w-1/5 md:w-1/5 sm:w-1/8 max-sm:w-1/8 flex justify-center items-center px-3 py-1'>
              <p className='text-white md:font-normal sm:font-bold max-sm:font-bold'>{event.age}+</p>
            </div>
          </div>
        </div>
        <div className='w-full flex flex-col gap-8 mt-0 md:mt-0 sm:mt-[25rem] max-sm:mt-[25rem]'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='text-[#212121] text-4xl font-semibold dark:text-slate-100'>{event.title}</h2>
            </div>
            <div className='w-1/8 sm:w-1/8 max-sm:w-1/4 min-w-1/8 max-w-1/4 rounded-md px-2 py-1 bg-black/10 flex justify-center items-center'>
              <h3 className='text-black/60 font-medium md:text-base sm:text-xs max-sm:text-xs uppercase'>{t(`event.genre.${event.genre}`)}</h3>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <NavigationMenu ref={menuRef}>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Button ref={firstButtonRef} className={`bg-white hover:bg-black/5 dark:bg-neutral-800 dark:text-slate-100 ${activeTab == 'tickets' ? 'text-black font-semibold' : 'text-black/50'}`} onClick={() => setActiveTab('tickets')}>
                      <span>{t('event.tickets')}</span>
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button className={`bg-white hover:bg-black/5 dark:bg-neutral-800 dark:text-slate-100 ${activeTab == 'about' ? 'text-black font-semibold' : 'text-black/50'}`} onClick={() => setActiveTab('about')}>
                      {event?.type == 'movie' ? t('event.about.movie') : t('event.about.event')}
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button className={`bg-white hover:bg-black/5 dark:bg-neutral-800 dark:text-slate-100 ${activeTab == 'reviews' ? 'text-black font-semibold' : 'text-black/50'}`} onClick={() => setActiveTab('reviews')}>
                      {t('event.reviews')}
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> 
              <Separator className='mt-3 bg-[#3D3D3D]'/>
            </div>
            <div>
              {activeTab == 'tickets' && <TicketsContent />}
              {activeTab == 'about' && <AboutContent />}
              {activeTab == 'reviews' && <ReviewsContent />}
              {/* тут */}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


export default EventItemDescPageBuilder