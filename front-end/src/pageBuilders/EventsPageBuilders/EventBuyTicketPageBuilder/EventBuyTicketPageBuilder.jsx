import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuth } from '@/src/context/AuthContext'

const EventBuyTicketPageBuilder = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const savedData = localStorage.getItem('currentReservation')
        if (!savedData) throw new Error('Бронирование не найдено')
        
        const data = JSON.parse(savedData)
        
        // Проверяем актуальность брони
        const response = await axios.get(`/api/cinemas/${data.cinemaId}/check-reservation`, {
          params: {
            hall: data.hall,
            seats: data.seats
          }
        })

        if (!response.data.valid) {
          throw new Error('Бронирование устарело или места уже заняты')
        }

        setReservation(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadReservation()
  }, [])

  const handlePaymentConfirmation = async () => {
    try {
      await axios.post('/api/cinemas/confirm-purchase', {
        cinemaId: reservation.cinemaId,
        hall: reservation.hall,
        seats: reservation.seats,
        userId: user?._id
      })

      // Очищаем данные бронирования
      localStorage.removeItem('currentReservation')
      
      router.push(`/profile/orders`)
    } catch (error) {
      console.error('Ошибка оплаты:', error)
      setError('Ошибка при обработке платежа')
    }
  }

  if (loading) return <div>Загрузка данных бронирования...</div>
  if (error) return <div className="text-red-500">Ошибка: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Детали бронирования</h2>
        <div className="space-y-2">
          <p><strong>Фильм:</strong> {reservation.eventTitle}</p>
          <p><strong>Кинотеатр:</strong> {reservation.cinemaName}</p>
          <p><strong>Зал:</strong> {reservation.hall}</p>
          <p><strong>Время сеанса:</strong> {reservation.sessionTime}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Выбранные места</h2>
        <div className="grid grid-cols-2 gap-4">
          {reservation.seats.map((seat, index) => (
            <div key={index} className="border p-4 rounded">
              <p>Ряд: {seat.row}, Место: {seat.seat}</p>
              <p>Тип билета: {seat.ticketType}</p>
              <p>Цена: {seat.price} ₸</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Оплата</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold">Итого к оплате: {reservation.totalPrice} ₸</p>
          </div>
          <button 
            onClick={handlePaymentConfirmation}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Подтвердить оплату
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventBuyTicketPageBuilder