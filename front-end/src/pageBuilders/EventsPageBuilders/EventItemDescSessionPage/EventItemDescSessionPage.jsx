"use client"
import React, { useEffect, useRef, useState,useCallback } from 'react'
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'
import ErrorCompanent from "../../../../src/components/error/ErrorCompanent"
import NotFoundCompanent from "../../../../src/components/not found/NotFoundCompanent"
import { Skeleton } from "@/src/ui/skeleton"
import Image from 'next/image'
import { Button } from '@/src/ui/button'
import { X } from 'lucide-react';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,DialogClose } from "@/src/ui/dialog"
import { Label } from "@/src/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/ui/radio-group"
import { GetCinemaByName } from '@/src/utils/GetCinemas/GetCinemas'
import { io } from 'socket.io-client'
import { GetToken } from '@/src/utils/GetToken/GetToken'
import { toast } from 'sonner'
import { setData } from '@/src/utils/DataTransfer/DataTransfer'
import '@/i18n'
import { useTranslation } from 'react-i18next'

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
        isVipSeats: true,
        vipSeats: [
          { row: 1, seat: 1 },
          { row: 1, seat: 2 },
          { row: 2, seat: 3 },
          { row: 2, seat: 4 },
          { row: 3, seat: 5 },
          { row: 3, seat: 6 },
          { row: 4, seat: 7 },
          { row: 4, seat: 8 },
          { row: 5, seat: 9 },
          { row: 5, seat: 10 },
        ],
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

// 1. 15 min logic


const EventItemDescSessionPage = () => {
  // const { cinema } = GetCinemaByName()
  const { t } = useTranslation('common')
  const { tokenUser } = GetToken() // Типо юзера получаем
  const [socket, setSocket] = useState(null)
  const reservationTimeoutRef = useRef(new Map())
  const params = useParams()
  const router = useRouter()
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [event, setEvent] = useState(null)
  const [session, setSession] = useState(null)
  const [cinema,setCinema] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [seatsConfig, setSeatsConfig] = useState({})
  const [imageError, setImageError] = useState(false)
  const [tempSeat, setTempSeat] = useState({})
  const [ticketType, setTicketType] = useState('adult')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [fixedDay,setFixedDay] = useState('')
  const [fixedMounth,setFixedMounth] = useState('')
  const [isTempSeatVip, setIsTempSeatVip] = useState(false)
  const [currentHall,setCurrentHall] = useState('')
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL)
    setSocket(newSocket)

    return () => newSocket.disconnect()
  }, [])
  const dateNow = new Date()
  const year = dateNow.getFullYear()
  useEffect(()=>{
    const currentDate = ()=>{
      const day = dateNow.getDate()
      const mounth = dateNow.getMonth()+1
      setFixedDay(day < 10 ? `0${day}` : `${day}`)
      setFixedMounth(mounth < 10 ? `0${mounth}` : `${mounth}`)
    }
    currentDate()
  },[])
  const getNormalDate = `${fixedDay}.${fixedMounth}.${year}`
  const GAP = 5
  const COLORS = {
    free: '#cccccc',
    bought: '#e30a13',
    reserved: '#5F5D5D',
    selected: '#00ff00',
    vip: '#FFD700'
  }

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
      const hallNumber = findSessionById?.hall?.match(/\d+/)?.[0]

      
      setEvent(eventResp.data)
      setSession(findSessionById)
      setCurrentHall(hallNumber)
      setCinema(findCinemaByName)
      setSeatsConfig((prev) => ({
        ...prev,
        rows: hallConfig.rows,
        seatsPerRow: hallConfig.seatsPerRow
      }))
 
    }
    catch (error){
      setError(error)
    }
    finally{
      setLoading(false)
    }
  }
  fetchSession()
},[params.nestedId,params.nestedId])
console.log(ticketType);

const drawSeats = useCallback(()=>{
  const canvas = canvasRef.current
  if(!canvas || !cinema || !session){
    return
  }

  const ctx = canvas.getContext('2d')
  const { rows, seatsPerRow } = seatsConfig

  const rect = canvas.getBoundingClientRect()
  const displayWidth = rect.width
  const displayHeight = rect.height

  const devicePixelRatio = window.devicePixelRatio || 1
  canvas.width = displayWidth * devicePixelRatio
  canvas.height = displayHeight * devicePixelRatio
  ctx.scale(devicePixelRatio, devicePixelRatio)
  
  const seatWidth = (displayWidth - GAP) / seatsPerRow - GAP
  const seatHeight = (displayHeight - GAP) / rows - GAP
  ctx.clearRect(0, 0, displayWidth, displayHeight)

  // Получение текущего зала
  const currentHall = cinema.halls.find((hall) => hall.name == session.hall)
  if(!currentHall){
    return
  }
  for(let row = 1; row <= rows; row++){
    for(let seat = 1; seat <= seatsPerRow; seat++){
      const isReserved = currentHall.reservedSeats.some((s) => s.row == row && s.seat == seat)
      const isBought = currentHall.boughtSeats.some((s) => s.row == row && s.seat == seat)
      const isVip = currentHall.isVipSeats && currentHall.VIPSeats.some((vip) => vip.row == row && vip.seat == seat)
      const isSelected = selectedSeats.some((s) => s.row == row && s.seat == seat)
      let seatColor = COLORS.free
      const x = GAP + (seat - 1) * (seatWidth + GAP)
      const y = GAP + (row - 1) * (seatHeight + GAP)
      if(isReserved){
        seatColor = COLORS.reserved
      }
      else if(isBought){
        seatColor = COLORS.bought
      }
      else if(isSelected){
        seatColor = COLORS.selected
      }
      else if (isVip) {
        seatColor = COLORS.vip
      }
      // ctx.fillStyle = isReserved ? COLORS.reserved : isSelected ? COLORS.selected : seatColor
      ctx.fillStyle = seatColor
      ctx.fillRect(x, y, seatWidth, seatHeight)
      // ctx.fillRect(x, y, SEAT_SIZE, SEAT_SIZE)
    }
  }
},[cinema,session,selectedSeats,seatsConfig])
useEffect(() => {
  drawSeats()
},[drawSeats])

const handleCanvasClick = (e)=>{
  // console.log(e);
  
  if(!session || !cinema){
    return
  }
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const x = (e.clientX - rect.left) * scaleX
  const y = (e.clientY - rect.top) * scaleY

  const { rows, seatsPerRow } = seatsConfig
  const seatWidth = (canvas.width - GAP) / seatsPerRow - GAP
  const seatHeight = (canvas.height - GAP) / rows - GAP

  const clickedRow = Math.floor(y / (seatHeight + GAP)) + 1
  const clickedSeat = Math.floor(x / (seatWidth + GAP)) + 1

  if(clickedRow > rows || clickedSeat > seatsPerRow){
    console.log(12);
    return
  }
  const currentHall = cinema.halls.find((hall) => hall.name == session.hall)
  // const isSelected = selectedSeats.some((seat) => seat.row == clickedRow && seat.seat == clickedSeat)
  const isReserved = currentHall.reservedSeats.some((s) => s.row == clickedRow && s.seat == clickedSeat)
  const isBought = currentHall.boughtSeats.some((s) => s.row == clickedRow && s.seat == clickedSeat)
  const isVip = currentHall?.VIPSeats.some((vip) => vip.row == clickedRow && vip.seat == clickedSeat)
  if(isReserved || isBought){
    toast('Место уже занято!');
    return;
  }
  setTempSeat({ row: clickedRow, seat: clickedSeat });
  setIsTempSeatVip(isVip)
  setIsDialogOpen(true);
  // socket.emit('checkSeat',
  //   {
  //     cinemaId: cinema._id,
  //     hall: session.hall, 
  //     row: clickedRow,
  //     seat: clickedSeat
  //   },
  //   (response)=>{
  //     if(response.available){
  //       console.log(response.available);
        
  //       setTempSeat({ row: clickedRow, seat: clickedSeat })
  //       setIsTempSeatVip(isVip)
  //       setIsDialogOpen(true)
  //     }
  //     else{
  //       toast('Место уже занято!')
  //     }
  // })
  // if(!isReserved && !isBought && !isSelected){
  //   setTempSeat({row: clickedRow,seat: clickedSeat })
  //   setIsTempSeatVip(isVip)
  //   setIsDialogOpen(true)
  // }
}
const addTicket = ()=>{
  const isAlreadySelected = selectedSeats.some((s) => s.row == tempSeat.row && s.seat == tempSeat.seat)
  if(!isAlreadySelected){
    const newSeat = {
      ...tempSeat,
      ticketType,
      price: ticketType == 'vip' ? session.vipPrice : ticketType == 'adult' ? session.adultPrice : session.childPrice,
    }
    setSelectedSeats((prev) => [...prev,newSeat])
    socket.emit('reserveSeat',{
      cinemaId: cinema._id,
      hall: session.hall,
      seat: tempSeat,
      userId: tokenUser?._id,
      sessionId: params.nestedId
    })
    // const timer = setTimeout(() => {
    //   setSelectedSeats((prev) =>
    //     prev.filter((s) => !(s.row == tempSeat.row && s.seat == tempSeat.seat))
    //   )
    //   // Уведомляем сервер об отмене резервации
    //   axios.post('/api/cinemas/cancelReservation',{
    //     cinemaId: cinema._id,
    //     hall: session.hall,
    //     seats: [tempSeat],
    //   })
    // }, 900000)
    // reservationTimeoutRef.current.set(
    //   `${tempSeat.row}-${tempSeat.seat}`,
    //   timer
    // )
    
    
    
    // const timer = setTimeout(async() => {
    //   setSelectedSeats(async(prev) => {
    //     prev.filter(s => !(s.row === tempSeat.row && s.seat === tempSeat.seat))
    //     await axios.post('/api/cinemas/cancelReservation', {
    //       cinemaId: cinema._id,
    //       hall: session.hall,
    //       seats: [tempSeat]
    //     })
    //   }, 900000) // 15 minutes
    //   reservationTimeoutRef.current.set(`${tempSeat.row}-${tempSeat.seat}`, timer)
    // })
  }
  setIsDialogOpen(false)
  setTicketType('adult')
  setIsTempSeatVip(false)
}
const removeTicket = ()=>{
  setIsDialogOpen(false)
  setTicketType('adult')
  setIsTempSeatVip(false)
}
const handlePayment = async () => {
  try {
    // Сохраняем выбранные места в localStorage
    const reservationData = {
      eventId: params.id,
      sessionId: params.nestedId,
      seats: selectedSeats,
      totalPrice,
      cinemaId: cinema._id,
      hall: session.hall
    }
    
    localStorage.setItem('currentReservation', JSON.stringify(reservationData))
    setData(reservationData)
    // Резервируем места через API
    await axios.post('/api/cinemas/reserve', {
      cinemaId: cinema._id,
      hall: session.hall,
      seats: selectedSeats.map((s) => ({ row: s.row, seat: s.seat })),
      userId: tokenUser?._id
    })

    router.push(`/events/${params.id}/${params.nestedId}/buy`)
  }
  catch(error){
    console.error('Ошибка при бронировании:', error)
    toast('Не удалось забронировать места')
  }
}
useEffect(() => {
  if (!socket || !cinema) return;

  const handleSeatUpdate = (updatedCinema) => {
    setCinema(updatedCinema);
    drawSeats();
  };

  socket.on('seatReserved', handleSeatUpdate);
  socket.on('seatPurchased', handleSeatUpdate);

  return () => {
    socket.off('seatReserved', handleSeatUpdate);
    socket.off('seatPurchased', handleSeatUpdate);
  };
}, [socket, cinema, drawSeats]);
const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0)

if(!session || !cinema){
  return (
    <>  
      <div className='h-[26rem] flex justify-center items-center'>
        <Label className='text-4xl'>Загрузка...</Label>
      </div>
    </>
    
  )
}
  return (
    <div className='flex flex-col gap-20 my-20'>
      <section  className='w-full px-5 flex flex-col gap-4'>
      <div className='flex gap-4 sm:flex-row max-sm:flex-col'>
        <div>
          { imageError ? (
            <Skeleton className='w-[10rem] sm:w-[10rem] max-sm:w-full h-[10rem] rounded-xl'/>
            ) : (
            <Image src={event?.image} alt={t('event.image.altNotFound')} onError={() => setImageError(true)} width={112} height={112} className='w-[10rem] sm:w-[10rem] max-sm:w-[5rem] h-auto rounded-xl'/>
          )}
        </div>
        <div className='flex flex-col justify-center gap-2 w-1/4 lg:w-1/4 md:w-1/3 sm:w-1/2 max-sm:w-full'>
          <div>
            <h1 className='text-2xl font-bold'>{event?.title}</h1>
          </div>
          <div className='flex gap-3'>
            <div>{getNormalDate} • {session?.time}</div>
            <div>{session?.sessionLaunguage}</div>
            <div>{event?.age}+</div>
          </div>
          <div>
            <div>{session?.sessionLocation} • {t(`event.session.hall.${currentHall}`)}</div>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <div className='w-full border border-gray-300 rounded-lg flex justify-center items-center py-12'>
          <canvas ref={canvasRef} onClick={handleCanvasClick} className=" cursor-pointer rounded-lg" style={{minWidth: '255px',minHeight: '255px',maxWidth:'455px',maxHeight:'455px',}}/>
        </div>
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className='bg-white'>
            <DialogHeader>
              <DialogTitle>{t('event.session.selectTicketType')}</DialogTitle>
            </DialogHeader>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex flex-col gap-4">
            {isTempSeatVip  ? (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vip" id="vip" className="cursor-pointer" />
                <Label htmlFor="vip" className="cursor-pointer">
                  {t('event.selectedSeats.type.vip')} - {session?.vipPrice || t('event.priceNotSpecified')} ₸
                </Label>
              </div>
            ) : (
              <>
                {session.isAdultPrice && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="adult" id="adult" className="cursor-pointer" />
                    <Label htmlFor="adult" className="cursor-pointer">
                      {t('event.selectedSeats.type.adult')} - {session?.adultPrice} ₸
                    </Label>
                  </div>
                )}
                {session?.isChildPrice && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="child" id="child" className="cursor-pointer" />
                    <Label htmlFor="child" className="cursor-pointer">
                      {t('event.selectedSeats.type.child')} - {session?.childPrice} ₸
                    </Label>
                  </div>
                )}
              </>
            )}
            </RadioGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={removeTicket}>{t('button.cancel')}</Button>
              </DialogClose>
              <Button onClick={addTicket}>{t('button.confirm')}</Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='w-full'>
        {selectedSeats.length > 0 && (
          <div className='flex flex-col gap-3'>
            <div className="mt-4 text-xl font-bold">
              {selectedSeats.length == 1 ? (
                <h2>{selectedSeats.length} {t('event.select.ticket')}: {totalPrice} ₸</h2>
              ) : (
                selectedSeats.length <= 4 && selectedSeats.length >= 1 ? (
                  <h2>{selectedSeats.length} {t('event.select.ticketa')}: {totalPrice} ₸</h2>
                ) : (
                  <h2>{selectedSeats.length} {t('event.select.tickets')}: {totalPrice} ₸</h2>
                )
              )}
              
            </div>
            <div className="grid grid-cols-6 gap-2 lg:grid-cols-6 sm:grid-cols-3 max-sm:grid-cols-1">
              {selectedSeats.map((seat, index) => (
                <div key={index} className="bg-white rounded-lg shadow px-4 py-6 lg:px-4 lg:py-6 sm:px-3 sm:py-4 max-sm:px-3 max-sm:py-4 flex justify-between">
                  <div>
                    <h2>{seat.row} {t('event.buy-card.row')}, {seat.seat} {t('event.buy-card.seat')}</h2>
                    <p>{seat.ticketType == 'vip' || seat.ticketType == 'VIP' ? 'VIP' : seat.ticketType == 'adult' ? t('event.adult') : t('event.child')} • {seat.price} ₸</p>
                  </div>
                  <div>
                    <X className='cursor-pointer w-[1.5rem] h-auto' onClick={() => setSelectedSeats((prev) => prev.filter((s) => !(s.row == seat.row && s.seat == seat.seat)))} />
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end'>
              <Button className='w-1/6 lg:w-1/6 md:w-1/4 sm:w-full max-sm:w-full h-[3rem] bg-[#00F000] font-semibold text-lg text-white cursor-pointer rounded-lg hover:bg-[#00C000]' onClick={handlePayment}>
                {t('button.proceedPayment')}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      </section>
    </div>
  )
}

export default EventItemDescSessionPage