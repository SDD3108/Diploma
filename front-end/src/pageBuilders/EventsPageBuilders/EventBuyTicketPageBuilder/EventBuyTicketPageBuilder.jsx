"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { GetEvent } from '@/src/utils/GetEvents/GetEvents'
import { GetCinemaById } from '@/src/utils/GetCinemas/GetCinemas'
import { Separator } from '@radix-ui/react-separator'

const EventBuyTicketPageBuilder = () => {
  const { tokenUser } = GetToken()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)
  const savedData = JSON.parse(localStorage.getItem('currentReservation'))
  const [cinema, setCinema] = useState(null)
  useEffect(()=>{
    const loadReservation = async () => {
      try{
        
        if(!savedData){
          return new Error('Бронирование не найдено')
        }
        // Проверяем актуальность брони
        console.log(savedData?.eventId);
        
        const response = await axios.get(`/api/cinemas/${savedData.cinemaId}/check-reservation`, {
          params: {
            hall: savedData.hall,
            seats: savedData.seats
          }
        })
        console.log(response.data);
        
        if(!response.data.valid){
          throw new Error('Бронирование устарело или места уже заняты')
        }
        setReservation(savedData)
      }
      catch(error){
        console.error('Ошибка загрузки бронирования:', error)
        setError(error.message)
      }
      finally{
        setLoading(false)
      }
    }
    const getEventRequest = async () => {
      try{
        const eventData = await GetEvent(savedData?.eventId)
        setEvent(eventData)
      }
      catch(error){
        console.error('Ошибка загрузки события:', error)
        setError('Ошибка загрузки события')
      }
    }
    const getCinemaRequest = async () => {
      try{
        const cinemaData = await GetCinemaById(savedData?.cinemaId)
        setCinema(cinemaData)
      }
      catch(error){
        console.error('Ошибка загрузки кинотеатра:', error)
        setError('Ошибка загрузки кинотеатра')
      }

    }
    loadReservation()
    getEventRequest()
    getCinemaRequest()
  },[])

  const handlePaymentConfirmation = async () => {
    try {
      await axios.post('/api/cinemas/confirm-purchase', {
        cinemaId: reservation.cinemaId,
        hall: reservation.hall,
        seats: reservation.seats,
        userId: tokenUser?._id
      })
      const purchaseData = {
        date: new Date(),
        eventId: reservation.eventId,
        sessionId: reservation.sessionId,
        ticketPrice: reservation.totalPrice,
        ticketCount: reservation.seats.length,
        ticketArray: reservation.seats.map(seat => ({
          place: `Ряд ${seat.row}, Место ${seat.seat}`,
          ticketType: seat.ticketType == 'vip' ? 'VIP' : seat.ticketType == 'child' ? 'Child' : 'Adult'
        }))
      }
      await axios.post('/api/users/add-purchase', 
        { userId: tokenUser?._id, purchase: purchaseData }
      )
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
      <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>
      <div className='flex gap-[2rem]'>
        <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Детали бронирования</h2>
          <div className="space-y-2 text-nowrap">
            <div className='flex justify-between'>
              <span className='font-bold'>Фильм</span>
              <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              <span className='text-gray-500'>{event?.title}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-bold'>Кинотеатр</span>
              <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              <span className='text-gray-500'>{cinema?.cinemaName}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-bold'>Зал</span>
              <div className='w-full border-b-[1px] mx-1.5 mb-1.5'></div>
              <span className='text-gray-500'>{reservation?.hall}</span>
            </div>
          </div>
        </div>
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Выбранные места</h2>
          <div className="grid grid-cols-1 gap-4">
            {reservation?.seats.map((seat, index) => (
              <div key={index} className="border p-4 rounded">
                <p>Ряд: {seat.row}, Место: {seat.seat}</p>
                <p>Тип билета: {seat.ticketType}</p>
                <p>Цена: {seat.price} ₸</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Оплата</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">Итого к оплате: {reservation.totalPrice} ₸</p>
          </div>
          <button onClick={handlePaymentConfirmation} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
            Подтвердить оплату
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventBuyTicketPageBuilder