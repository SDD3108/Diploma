const TicketFlow = require('../../src/models/cinemas')
const mongoose = require('mongoose')
const getAllCinemas = async(req,res)=>{
  const events = await TicketFlow.find()
  res.status(200).json(events)
}
const getCinemaById = async(req,res)=>{
  const event = await TicketFlow.findById(req.params.id)
  if(!event){
    return res.status(404).json({message:'событие не найдено'})
  }
  res.status(200).json(event)
}
const createCinema = async (req,res)=>{
  const eventData = req.body
  if(eventData.rating !== undefined){
    eventData.isRating = true
  }
  const newEvent = new TicketFlow(eventData)
  await newEvent.save()
  res.status(201).json(newEvent)
}
const updateCinema = async(req,res)=>{
  const updates = req.body
  if(updates.rating !== undefined){
    updates.isRating = true
  }
  else if(updates.rating == null){
    updates.isRating = false
  }
  const updatedEvent = await TicketFlow.findByIdAndUpdate(
    req.params.id,
    updates,
    {new:true, runValidators: true }
  )
  if(!updatedEvent){
    return res.status(404).json({message:'событие не найдено'})
  }
  res.status(200).json(updatedEvent)

}
const reserveSeats = async (req,res)=>{
  try{
    const { cinemaId,hall,seats,sessionId } = req.body
    const cinema = await TicketFlow.findByIdAndUpdate(
      cinemaId,
      {
        $push:{'halls.$[hall].reservedSeats':{$each: seats}}
      },
      { 
        arrayFilters:[{'hall.name': hall}],
        new:true
      },
    )
    setTimeout(async()=>{
      await TicketFlow.findByIdAndUpdate(
        cinemaId,
        {
          $pull: {'halls.$[hall].reservedSeats':{$in: seats}}
        },
        {
          arrayFilters:[{'hall.name': hall}]
        }
      )
    },900000)
    res.status(200).json(cinema)
  }
  catch(error){
    res.status(500).json({error:'ошибка бронирования'})
  }
}

const purchaseSeats = async(req,res)=>{
  try{
    const { cinemaId,hall,seats,sessionId } = req.body
    const cinema = await TicketFlow.findByIdAndUpdate(
      cinemaId,
      { 
        $pull:{'halls.$[hall].reservedSeats':{$in: seats}},
        $push:{'halls.$[hall].boughtSeats':{$each: seats}},
      },
      { 
        arrayFilters:[{'hall.name': hall}],
        new: true,
      }
    )
    res.status(200).json(cinema)
  }
  catch(error){
    res.status(500).json({error:'ошибка подтверждения покупки'})
  }
}
const checkReservation = async (req,res)=>{
  try{
    const cinema = await TicketFlow.findById(req.params.id)
    if(!cinema){
      return res.status(404).json({error:'кинотеатр не найден'})
    }
    const hall = cinema.halls.find((h) => h.name == req.query.hall)
    if(!hall){
      return res.status(404).json({error:'Зал не найден'})
    }
    const seats = []
    Object.keys(req.query).forEach((element)=>{
      const match = element.match(/^seats\[(\d+)\]\[(\w+)\]$/)
      if(match){
        const index = parseInt(match[1],10)
        const field = match[2]
        if(!seats[index]){
          seats[index] = {}
        }
        seats[index][field] = req.query[element]
      }
    })
    const valid = seats.every((seat) => hall.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat))
    res.status(200).json({valid})
  }
  catch(error){
    res.status(500).json({error:'Ошибка проверки бронирования'})
  }
}
const confirmPurchase = async(req,res)=>{
  try{
    const { cinemaId,hall,seats,userId } = req.body
    const now = new Date()
    const day = String(now.getDate()).padStart(2,'0')
    const month = String(now.getMonth() + 1).padStart(2,'0')
    const year = now.getFullYear().toString().slice(2)
    const date = `${day}.${month}.${year}`
    if(!cinemaId || !hall || !seats || !userId){
      return res.status(400).json({ error: "пустые или неопредиленные значения" })
    }
    const updateQuery = {
      $pull:{ 
        "halls.$[hallElem].reservedSeats":{
          $or:seats.map((seat)=>({
            row: parseInt(seat.row),
            seat: parseInt(seat.seat),
          }))
        }
      },
      $push:{
        "halls.$[hallElem].boughtSeats":{
          $each:seats.map((seat)=>({
            row: parseInt(seat.row),
            seat: parseInt(seat.seat),
            userId:userId,
            purchasedAt:date
          }))
        }
      }
    }
    const result = await TicketFlow.findOneAndUpdate(
      {
        _id:cinemaId,
        "halls.name": hall
      },
      updateQuery,
      {
        arrayFilters:[{"hallElem.name": hall}],
        new:true,
      }
    )
    if(!result){
      return res.status(404).json({ error: "кинотеатр или зал не были найдены"})
    }
    res.status(200).json({success:true})
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
}
const seatsCheck = async(req,res)=>{
  try {
    const cinema = await TicketFlow.findById(req.body.cinemaId)
    const hall = cinema.halls.find((h) => h.name == req.body.hall)
    const isAvailable = req.body.seats.every((seat) => !hall.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat) && !hall.boughtSeats.some((s) => s.row == seat.row && s.seat == seat.seat))
    res.json({available: isAvailable})
  }
  catch(error){
    res.status(500).json({error: 'Server error'})
  }
}
module.exports = {seatsCheck,getAllCinemas,getCinemaById,createCinema,updateCinema,reserveSeats,purchaseSeats,checkReservation,confirmPurchase}