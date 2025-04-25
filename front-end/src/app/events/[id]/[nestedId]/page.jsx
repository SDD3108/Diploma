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
import React, { useEffect, useRef, useState,useCallback } from 'react'
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'

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
  const [session, setSession] = useState(null)
  const [cinema,setCinema] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsConfig, setSeatsConfig] = useState({
    seatWidth: 30,
    seatHeight: 30,
    gap: 10,
    rows: 0,
    seatsPerRow: 0
  })

  // Загрузка данных о сеансе
useEffect(() => {
    const fetchSession = async () => {
      try {
        const eventResp = await axios.get(`/api/events/${params.id}`)
        const sessions = eventResp.data.sessions
        const findSessionById = sessions.find((session)=>session._id == params.nestedId)
        const cinemaResp = await axios.get(`/api/cinemas`)
        const findCinemaByName = cinemaResp.data.find((cinema)=>cinema.cinemaName == findSessionById.sessionLocation)
        if (!findCinemaByName || !findSessionById) {
          throw new Error('Data not found')
        }
        const hallConfig = targetCinema.halls.find((hall) => hall.name == findSessionById.hall)
        setSession(findSessionById)
        setCinema(findCinemaByName)
        setSeatsConfig((prev) => ({...prev, rows: hallConfig.rows,seatsPerRow: hallConfig.seatsPerRow}))
        
      }
      catch (error) {
        console.error('Error fetching session:', error)
      }
  }
  fetchSession()
},[params.nestedId,params.nestedId])
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-8 text-center">{session?.movieTitle}</h1>
      
      <div className="flex justify-center mb-8">
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border-2 border-gray-300 w-full cursor-pointer"
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