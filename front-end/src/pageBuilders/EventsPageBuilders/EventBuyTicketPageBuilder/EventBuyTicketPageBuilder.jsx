"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { GetEvent } from '@/src/utils/GetEvents/GetEvents'
import { GetCinemaById } from '@/src/utils/GetCinemas/GetCinemas'
import { Separator } from '@radix-ui/react-separator'
import '@/i18n'
import { useTranslation } from 'react-i18next'
// import GetToken from '@/src/store/AuthStore/authStore'

const EventBuyTicketPageBuilder = () => {
  const { t } = useTranslation('common')
  const { tokenUser } = GetToken()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)
  const savedData = JSON.parse(localStorage.getItem('currentReservation'))
  const [cinema, setCinema] = useState(null)
  const [displaySize,setDisplaySize] = useState(window.innerWidth,)
  const backendApi = process.env.NEXT_PUBLIC_SOCKET_URL
  useEffect(()=>{
    const loadReservation = async () => {
      try{
        
        if(!savedData){
          return new Error('Бронирование не найдено')
        }
        // Проверяем актуальность брони
        // console.log(savedData?.eventId);
        
        const response = await axios.get(`/api/cinemas/${savedData.cinemaId}/check-reservation`, {
          params: {
            hall: savedData.hall,
            seats: savedData.seats
          }
        })
        // console.log(response.data);
        
        if(!response.data.valid){
          throw new Error('Бронирование устарело или места уже заняты')
        }
        setReservation(savedData)
        const [eventData, cinemaData] = await Promise.all([
          GetEvent(savedData.eventId),
          GetCinemaById(savedData.cinemaId)
        ])
        setEvent(eventData)
        setCinema(cinemaData)
      }
      catch(error){
        // console.error('Ошибка загрузки бронирования:', error)
        setError(error.message)
      }
      finally{
        setLoading(false)
      }
    }
    const getEventRequest = async () => {
      try{
        console.log(savedData);
        
        const eventData = await GetEvent(savedData?.eventId)
        setEvent(eventData)
      }
      catch(error){
        // console.error('Ошибка загрузки события:', error)
        setError('Ошибка загрузки события')
      }
    }
    const getCinemaRequest = async () => {
      try{
        const cinemaData = await GetCinemaById(savedData?.cinemaId)
        setCinema(cinemaData)
      }
      catch(error){
        // console.error('Ошибка загрузки кинотеатра:', error)
        setError('Ошибка загрузки кинотеатра')
      }

    }
    const getDisplaySize = ()=>{
      const display = window.innerWidth
      setDisplaySize(display)
    }
    loadReservation()
    getEventRequest()
    getCinemaRequest()
    window.addEventListener('resize', getDisplaySize)
  },[])
// console.log(displaySize);

  const handlePaymentConfirmation = async () => {
    try{
      const now = new Date()
      const day = String(now.getDate()).padStart(2,'0')
      const month = String(now.getMonth() + 1).padStart(2,'0')
      const year = now.getFullYear()
      const date = `${day}.${month}.${year}`
      await axios.post('/api/cinemas/confirm-purchase',{
        date:now,
        cinemaId: reservation.cinemaId,
        hall: reservation.hall,
        seats: reservation.seats,
        userId: tokenUser?._id
      })
      const purchaseData = {
        date: date,
        eventId: reservation.eventId,
        sessionId: reservation.sessionId,
        ticketPrice: reservation.totalPrice,
        ticketCount: reservation.seats.length,
        ticketArray: reservation.seats.map((seat) => ({
          place: `Ряд ${seat.row}, Место ${seat.seat}`,
          ticketType: seat.ticketType == 'vip' ? 'VIP' : seat.ticketType == 'child' ? 'Child' : 'Adult'
        }))
      }
      await axios.post('/api/users/add-purchase',{userId:tokenUser?._id,purchase: purchaseData})
      await axios.post(`/api/users/${tokenUser?._id}/add-message`,{title: event?.title})
      await axios.post(`${backendApi}/send-email`,{
        from: 'mrbimson1@gmail.com',
        to: tokenUser?.email,
        subject: 'Квитанция о покупке',
        text: `Поздравляем с успешной покупкой билета ${tokenUser?.name}!`,
        html: `
          <p>Благодарим вас уважаемый <strong>${tokenUser?.name},</strong></p>
          <p>вы успешно приобрели билет на фильм: <strong>${event?.title}.</strong></p>
        `
      })
      localStorage.removeItem('currentReservation')
      // после успешной оплаты добавляем покупку пользователю в purchasedTickets
      router.push(`/profile`)
    }
    catch(error){
      console.error('Ошибка оплаты:', error)
      setError('Ошибка при обработке платежа')
    }
  }

  if (loading){
    return(
      <div className="font-semibold h-[26rem]">
        <h2>Загрузка данных бронирования...</h2>
      </div>
    )
  } 
  if (error){
    return(
      <div className="text-red-500 font-semibold h-[26rem]">
        <h2>Ошибка, {error}</h2>
      </div>
    )
  }

  return (
    <div className="px-5 py-7">
      <div className='text-2xl font-bold mb-6'>
        <h1>{t('checkout.page.title')}</h1>
      </div>
      <div className='flex gap-[2rem] sm:flex-row max-sm:flex-col'>
        <div className="w-full bg-white rounded-lg shadow-md p-6 sm:px-6 max-sm:px-3 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.reservationDetails.title')}</h2>
          <div className="space-y-2 text-nowrap">
            {displaySize <= 384 ? (
              <div className='flex flex-col'>
                <span className='font-bold'>{t('checkout.reservationDetails.movie')}</span>
                <span className='text-gray-500 text-end'>{event?.title}</span>
                <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              </div>
            ) : (
              <div className='flex justify-between'>
                <span className='font-bold'>{t('checkout.reservationDetails.movie')}</span>
                <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
                <span className='text-gray-500'>{event?.title}</span>
              </div>
            )}
            {displaySize <= 384 ? (
              <div className='flex flex-col'>
                <span className='font-bold'>{t('checkout.reservationDetails.cinema')}</span>
                <span className='text-gray-500 text-end'>{cinema?.cinemaName}</span>
                <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              </div>
            ) : (
              <div className='flex justify-between'>
                <span className='font-bold'>{t('checkout.reservationDetails.cinema')}</span>
                <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
                <span className='text-gray-500'>{cinema?.cinemaName}</span>
              </div>
            )}
            {displaySize <= 384 ? (
              <div className='flex flex-col'>
              <span className='font-bold'>{t('checkout.reservationDetails.hall')}</span>
              <span className='text-gray-500 text-end'>{reservation?.hall}</span>
              <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
            </div>
            ) : (
              <div className='flex justify-between'>
                <span className='font-bold'>{t('checkout.reservationDetails.hall')}</span>
                <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
                <span className='text-gray-500'>{reservation?.hall}</span>
              </div>
            )}
          </div>
        </div>
        <div className="w-1/3 sm:w-1/2 max-sm:w-full bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.selectedSeats.title')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {reservation?.seats.map((seat, index) => (
              <div key={index} className="border p-4 rounded">
                <p>{t('event.buy-card.row')}: {seat.row}, {t('event.buy-card.seat')}: {seat.seat}</p>
                <p>{t('checkout.seat.ticketType')}: {seat.ticketType}</p>
                <p>{t('checkout.seat.price')}: {seat.price} ₸</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('checkout.payment.title')}</h2>
        <div className="flex sm:flex-row max-sm:flex-col sm:items-center max-sm:items-start justify-between items-center">
          <div>
            <p className="text-lg font-bold">{t('checkout.payment.total')} {reservation?.totalPrice}₸</p>
          </div>
          <div>
            <button onClick={handlePaymentConfirmation} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">{t('button.confirmPayment')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventBuyTicketPageBuilder