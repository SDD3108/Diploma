// "use client"
// import React, { useEffect, useState, useMemo,useRef } from 'react'
// import { useParams,useRouter } from "next/navigation";
// const page = () => {
//   const params = useParams()
//   const router = useRouter()
//   const [event, setEvent] = useState({})
//   const [session,setSession] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   useEffect(()=>{
//     const getEvents = async ()=>{
//       try{
//         const resp = await axios.get('/api/events')
//         const findEventById = resp.data.find((event)=>event._id == params.id)
//         if(!findEventById){
//           return router.push(`/events/${params.id}`)
//         }
//         setEvent(findEventById)
//         const findSessionById = findEventById.sessions.find((session)=>session.cinemaId == params.nestedId)
//         if(!findSessionById){
//           return router.push(`/events/${params.id}`)
//         }
//         setSession(findSessionById)
//       }
//       catch(err){
//         setError(err.resp?.data?.message || err.message || 'Unknown error')
//       }
//       finally{
//         setLoading(false)
//       }
//     }
//     getEvents()
//   },[])

//   return (
//     <div>desc{params.nestedId}</div>
//   )
// }

// export default page

"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'

const cinemas = [
  { id: 1, name: 'Кинотеатр 1' },
  { id: 2, name: 'Кинотеатр 2' },
  { id: 3, name: 'Кинотеатр 3' },
  { id: 4, name: 'Кинотеатр 4' },
  { id: 5, name: 'Кинотеатр 5' },
]

const SeatsPage = () => {
  const params = useParams()
  const router = useRouter()
  const canvasRef = useRef(null)
  const [session, setSession] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsConfig, setSeatsConfig] = useState({
    rows: 10,
    seatsPerRow: 15,
    seatWidth: 30,
    seatHeight: 30,
    gap: 10
  })

  // Загрузка данных о сеансе
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`/api/events/${params.id}/${params.nestedId}`)
        setSession(response.data)
      } catch (error) {
        console.error('Error fetching session:', error)
      }
    }
    fetchSession()
  }, [params.nestedId])

  // Отрисовка мест при изменении данных
  useEffect(() => {
    if (!session) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Настройки Canvas
    const { rows, seatsPerRow, seatWidth, seatHeight, gap } = seatsConfig
    canvas.width = seatsPerRow * (seatWidth + gap) + gap
    canvas.height = rows * (seatHeight + gap) + gap

    // Функция отрисовки одного места
    const drawSeat = (row, seatNum, isSelected = false, isReserved = false) => {
      const x = gap + (seatNum - 1) * (seatWidth + gap)
      const y = gap + (row - 1) * (seatHeight + gap)
      
      ctx.fillStyle = isReserved ? '#ff0000' : 
                     isSelected ? '#00ff00' : 
                     '#cccccc'
      ctx.fillRect(x, y, seatWidth, seatHeight)
    }

    // Очистка и перерисовка
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Рисуем все места
    for (let row = 1; row <= rows; row++) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const isReserved = session.reservedSeats?.some(s => 
          s.row === row && s.seat === seatNum
        )
        const isSelected = selectedSeats.some(s => 
          s.row === row && s.seat === seatNum
        )
        drawSeat(row, seatNum, isSelected, isReserved)
      }
    }
  }, [session, selectedSeats, seatsConfig])

  // Обработчик клика по Canvas
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { rows, seatsPerRow, seatWidth, seatHeight, gap } = seatsConfig
    
    const row = Math.floor(y / (seatHeight + gap)) + 1
    const seatNum = Math.floor(x / (seatWidth + gap)) + 1

    // Проверка на валидность места
    if (row > rows || seatNum > seatsPerRow) return

    // Проверка занятости
    const isReserved = session.reservedSeats?.some(s => 
      s.row === row && s.seat === seatNum
    )
    if (isReserved) return

    // Обновление выбранных мест
    setSelectedSeats(prev => {
      const existing = prev.find(s => s.row === row && s.seat === seatNum)
      return existing 
        ? prev.filter(s => !(s.row === row && s.seat === seatNum))
        : [...prev, { row, seat: seatNum }]
    })
  }

  // Расчет общей стоимости
  const totalPrice = selectedSeats.reduce((acc, seat) => {
    return acc + (session?.seatPrice || 300)
  }, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-8 text-center">{session?.movieTitle}</h1>
      
      <div className="flex justify-center mb-8">
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border-2 border-gray-300 cursor-pointer"
        />
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Выбранные места:</h2>
          <div className="grid grid-cols-2 gap-4">
            {selectedSeats.map((seat, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <p>Ряд: {seat.row}</p>
                <p>Место: {seat.seat}</p>
                <p>Цена: {session?.seatPrice} руб.</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xl font-bold">
            Общая сумма: {totalPrice} руб.
          </div>
          <button 
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => console.log('Переход к оплате', selectedSeats)}
          >
            Перейти к оплате
          </button>
        </div>
      )}
    </div>
  )
}

export default SeatsPage