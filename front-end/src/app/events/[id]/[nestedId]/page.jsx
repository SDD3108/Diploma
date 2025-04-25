// "use client"
// import React, { useEffect, useState, useMemo,useRef } from 'react'
// import { useParams,useRouter } from "next/navigation";
// const page = () => {
//   const params = useParams()
//   const router = useRouter()
//   const [event, setEvent] = useState({})
  // const [session,setSession] = useState({})
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)
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
import React, { useEffect, useRef, useState,useCallback } from 'react'
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'
import ErrorCompanent from "@/src/companents/error/ErrorCompanent"
import NotFoundCompanent from "@/src/companents/not found/NotFoundCompanent"
import HeaderCompanent from '@/src/companents/header/HeaderCompanent'
import FooterCompanent from '@/src/companents/footer/FooterCompanent'


const cinemas = [
  {
    id: 1,
    name: 'Кинотеатр 1',
    cinemaAddress:'',
    cinemaRate: 4.5,
    reviewsCount: 120,
    reviews: [
      { user: 'User1', text: 'Отличный кинотеатр!',grade: 5 },
      { user: 'User2', text: 'Хорошее качество изображения.',grade: 4 },
    ],
    halls: [
      {
        id: 1,
        name: 'Зал 1',
        capacity: 100,
        rows: 10,
        seatsPerRow: 10,
        reservedSeats:[
          {
            row: 1,
            seat: 1,
          },
          {
            row: 1,
            seat: 2,
          },
          {
            row: 2,
            seat: 3,
          },
        ],
      },
    ],
  },
]

const SeatsPage = () => {
  const params = useParams()
  const router = useRouter()
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [session, setSession] = useState(null)
  const [cinema,setCinema] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsConfig, setSeatsConfig] = useState({})

  const GAP = 5
  const SEAT_SIZE = 30
  const COLORS = {
    free: '#cccccc',
    reserved: '#5F5D5D',
    selected: '#00ff00',
  }

  // Загрузка данных о сеансе
useEffect(() => {
  const fetchSession = async ()=>{
    try {
      const eventResp = await axios.get(`/api/events/${params.id}`)
      const sessions = eventResp.data.sessions
      const findSessionById = sessions.find((session)=>session._id == params.nestedId)
      const cinemaResp = await axios.get(`/api/cinemas`)
      const findCinemaByName = cinemaResp.data.find((cinema)=>cinema.cinemaName == findSessionById.sessionLocation)
      if(!findCinemaByName || !findSessionById){
        setError('Data not found')
        return
      }
      const hallConfig = findCinemaByName.halls.find((hall) => hall.name == findSessionById.hall)
      setSession(findSessionById)
      setCinema(findCinemaByName)
      setSeatsConfig((prev) => ({
        ...prev,
        rows: hallConfig.rows,
        seatsPerRow: hallConfig.seatsPerRow
      }))
 
    }
    catch (error){
      setError(error)
      // console.error('Error fetching session:', error)
    }
    finally{
      setLoading(false)
    }
  }
  fetchSession()
},[params.nestedId,params.nestedId])

const drawSeats = useCallback(() => {
  const canvas = canvasRef.current
  if (!canvas || !cinema || !session){
    return
  }

  const ctx = canvas.getContext('2d')
  const { rows, seatsPerRow } = seatsConfig

  const canvasWidth = seatsPerRow * (SEAT_SIZE + GAP) + GAP
  const canvasHeight = rows * (SEAT_SIZE + GAP) + GAP
  
  // Рассчёт размеров canvas
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  console.log(canvas.width,canvas.height);

  // Очистка
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Получение текущего зала
  const currentHall = cinema.halls.find((hall) => hall.name == session.hall)
  if(!currentHall){
    return
  }
  for(let row = 1; row <= rows; row++){
    for(let seat = 1; seat <= seatsPerRow; seat++){
      const isReserved = currentHall.reservedSeats.some((s) => s.row == row && s.seat == seat)
      const isSelected = selectedSeats.some((s) => s.row == row && s.seat == seat)
      const x = GAP + (seat - 1) * (SEAT_SIZE + GAP)
      const y = GAP + (row - 1) * (SEAT_SIZE + GAP)

      ctx.fillStyle = isReserved ? COLORS.reserved : isSelected ? COLORS.selected : COLORS.free
      ctx.fillRect(x, y, SEAT_SIZE, SEAT_SIZE)
    }
  }
},[cinema,session,selectedSeats,seatsConfig])
useEffect(() => {
  drawSeats()
},[drawSeats])

// Обработка клика
const handleCanvasClick =(e)=>{
  if(!session || !cinema){
    return
  }
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const { rows, seatsPerRow } = seatsConfig

  const clickedRow = Math.floor(y / (SEAT_SIZE + GAP)) + 1
  const clickedSeat = Math.floor(x / (SEAT_SIZE + GAP)) + 1
  if(clickedRow > rows || clickedSeat > seatsPerRow){
    return
  }
  const currentHall = cinema.halls.find(h => h.name == session.hall)
  const isReserved = currentHall.reservedSeats.some(
    s => s.row == clickedRow && s.seat == clickedSeat
  )
  if(isReserved){
    return
  }

  // Обновление выбранных мест
  setSelectedSeats(prev => {
    const exists = prev.some((s) => s.row == clickedRow && s.seat == clickedSeat)
    return exists ? prev.filter((s) => !(s.row == clickedRow && s.seat == clickedSeat)) : [...prev,{ row: clickedRow, seat: clickedSeat}]
  })
}
const totalPrice = selectedSeats.reduce((acc,seat)=>{
  return acc + (session?.adultPrice || 0)
},0)

if(!session || !cinema){
  return (
    <>
      <HeaderCompanent/>
      <div>Загрузка...</div>
      <FooterCompanent/>
    </>
    
  )
}


  return (
    <div className='flex flex-col gap-20'>
    <HeaderCompanent/>
    <div  className='mx-auto'>
      <h1 >{session?.movieTitle}</h1>
      <div className='overflow-auto'>
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="mx-auto border-2 border-gray-300 cursor-pointer"
          style={{
            minWidth: '350px',
            minHeight: '350px',
          }}
        />
      </div>

      {selectedSeats.length > 0 && (
        <div >
          <div className="grid grid-cols-2">
            {selectedSeats.map((seat, index) => (
              <div key={index} className="bg-white rounded shadow">
                <p>{seat.row} Ряд, {seat.seat} Место</p>
                <p>Цена: {session?.adultPrice} KZT</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xl font-bold">
            Общая сумма: {totalPrice} KZT
          </div>
          <button className="mt-4 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => console.log('Переход к оплате', selectedSeats)}>
            Перейти к оплате
          </button>
        </div>
      )}
    </div>
    <FooterCompanent/>
    </div>
  )
}

export default SeatsPage