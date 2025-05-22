const TicketFlow = require('../../src/models/cinemas')
const mongoose = require('mongoose')

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin:'http://localhost:3000',
    methods:['GET','POST'],
    credentials: true,
  },
  transports: ['websocket'],
  path:'/socket.io',
})

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
    console.log('Request body:', req.body)
    const { cinemaId,hall,seats,userId,sessionId } = req.body
    // const cinema = await TicketFlow.findByIdAndUpdate(
    //   cinemaId,
    //   {
    //     $push:{'halls.$[hall].reservedSeats':{$each: seats}}
    //   },
    //   { 
    //     arrayFilters:[{'hall.name': hall}],
    //     new:true
    //   },
    // )
    if(!cinemaId || !hall || !seats || !userId || !sessionId){
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    const cinema = await TicketFlow.findById(cinemaId)
    const hallConfig = cinema.halls.find((h) => h.name == hall)
    const occupiedSeats = []

    seats.forEach((seat)=>{
      const isOccupied = hallConfig.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat) || hallConfig.boughtSeats.some((s) => s.row == seat.row && s.seat == seat.seat)
      if(isOccupied){
        occupiedSeats.push(seat)
      }
    })
    if(occupiedSeats.length > 0){
      return res.status(400).json({ 
        success: false, 
        message: 'Некоторые места уже заняты',
        occupiedSeats, 
      })
    }
    const reservations = seats.map(seat => ({
      row: seat.row,
      seat: seat.seat,
      userId,
      reservedAt: new Date(),
      sessionId,
    }))
    hallConfig.reservedSeats.push(...reservations)
    await cinema.save()

    const updatedCinema = await TicketFlow.findById(cinemaId)
    .populate('halls.reservedSeats.userId')
    .lean()

    const room = `${cinemaId}_${sessionId}`
    io.to(room).emit('seatsReserved', updatedCinema)
    res.status(200).json({ success: true })
    // setTimeout(async()=>{
    //   await TicketFlow.findByIdAndUpdate(
    //     cinemaId,
    //     {
    //       $pull: {'halls.$[hall].reservedSeats':{$in: seats}}
    //     },
    //     {
    //       arrayFilters:[{'hall.name': hall}]
    //     }
    //   )
    // },900000)
    // res.status(200).json(cinema)
  }
  catch(error){
    console.log(error)
    res.status(500).json({error:'ошибка бронирования'})
  }
  // try {
  //   const { cinemaId, hall, seats, userId, sessionId } = req.body;
    
  //   const cinema = await TicketFlow.findById(cinemaId);
  //   const hallConfig = cinema.halls.find(h => h.name === hall);
    
  //   // Проверка доступности всех мест
  //   const isAnySeatOccupied = seats.some(seat => 
  //     hallConfig.reservedSeats.some(s => s.row === seat.row && s.seat === seat.seat) ||
  //     hallConfig.boughtSeats.some(s => s.row === seat.row && s.seat === seat.seat)
  //   );

  //   if (isAnySeatOccupied) {
  //     return res.status(400).json({ success: false, message: 'Некоторые места уже заняты' });
  //   }

  //   // Добавляем резервации
  //   const reservations = seats.map(seat => ({
  //     ...seat,
  //     userId,
  //     reservedAt: new Date(),
  //     sessionId
  //   }));

  //   hallConfig.reservedSeats.push(...reservations);
  //   await cinema.save();

  //   res.json({ success: true });
  // }
  // catch(error){
  //   res.status(500).json({ success: false, message: 'Ошибка сервера' });
  // }
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


// module.exports = (io) => {
//   return {
//     getAllCinemas:async(req,res)=>{
//       const events = await TicketFlow.find()
//       res.status(200).json(events)
//     },
//     getCinemaById:async(req,res)=>{
//       const event = await TicketFlow.findById(req.params.id)
//       if(!event){
//         return res.status(404).json({message:'событие не найдено'})
//       }
//       res.status(200).json(event)
//     },
//     createCinema:async (req,res)=>{
//       const eventData = req.body
//       if(eventData.rating !== undefined){
//         eventData.isRating = true
//       }
//       const newEvent = new TicketFlow(eventData)
//       await newEvent.save()
//       res.status(201).json(newEvent)
//     },
//     updateCinema:async(req,res)=>{
//       const updates = req.body
//       if(updates.rating !== undefined){
//         updates.isRating = true
//       }
//       else if(updates.rating == null){
//         updates.isRating = false
//       }
//       const updatedEvent = await TicketFlow.findByIdAndUpdate(
//         req.params.id,
//         updates,
//         {new:true, runValidators: true }
//       )
//       if(!updatedEvent){
//         return res.status(404).json({message:'событие не найдено'})
//       }
//       res.status(200).json(updatedEvent)
    
//     },
//     reserveSeats:async (req,res)=>{
//       try{
//         console.log('Request body:', req.body)
//         const { cinemaId,hall,seats,userId,sessionId } = req.body
//         // const cinema = await TicketFlow.findByIdAndUpdate(
//         //   cinemaId,
//         //   {
//         //     $push:{'halls.$[hall].reservedSeats':{$each: seats}}
//         //   },
//         //   { 
//         //     arrayFilters:[{'hall.name': hall}],
//         //     new:true
//         //   },
//         // )
//         if(!cinemaId || !hall || !seats || !userId || !sessionId){
//           return res.status(400).json({ 
//             success: false, 
//             message: 'Missing required fields' 
//           });
//         }
//         const cinema = await TicketFlow.findById(cinemaId)
//         const hallConfig = cinema.halls.find((h) => h.name == hall)
//         const occupiedSeats = []
    
//         seats.forEach((seat)=>{
//           const isOccupied = hallConfig.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat) || hallConfig.boughtSeats.some((s) => s.row == seat.row && s.seat == seat.seat)
//           if(isOccupied){
//             occupiedSeats.push(seat)
//           }
//         })
//         if(occupiedSeats.length > 0){
//           return res.status(400).json({ 
//             success: false, 
//             message: 'Некоторые места уже заняты',
//             occupiedSeats, 
//           })
//         }
//         const reservations = seats.map(seat => ({
//           row: seat.row,
//           seat: seat.seat,
//           userId,
//           reservedAt: new Date(),
//           sessionId,
//         }))
//         hallConfig.reservedSeats.push(...reservations)
//         await cinema.save()
    
//         const room = `${cinemaId}_${sessionId}`
//         io.to(room).emit('seatsReserved', cinema)
//         res.status(200).json({ success: true })
//       }
//       catch(error){
//         console.log(error)
//         res.status(500).json({error:'ошибка бронирования'})
//       }
//     },
//     purchaseSeats:async(req,res)=>{
//       try{
//         const { cinemaId,hall,seats,sessionId } = req.body
//         const cinema = await TicketFlow.findByIdAndUpdate(
//           cinemaId,
//           { 
//             $pull:{'halls.$[hall].reservedSeats':{$in: seats}},
//             $push:{'halls.$[hall].boughtSeats':{$each: seats}},
//           },
//           { 
//             arrayFilters:[{'hall.name': hall}],
//             new: true,
//           }
//         )
//         res.status(200).json(cinema)
//       }
//       catch(error){
//         res.status(500).json({error:'ошибка подтверждения покупки'})
//       }
//     },
//     checkReservation:async (req,res)=>{
//       try{
//         const cinema = await TicketFlow.findById(req.params.id)
//         if(!cinema){
//           return res.status(404).json({error:'кинотеатр не найден'})
//         }
//         const hall = cinema.halls.find((h) => h.name == req.query.hall)
//         if(!hall){
//           return res.status(404).json({error:'Зал не найден'})
//         }
//         const seats = []
//         Object.keys(req.query).forEach((element)=>{
//           const match = element.match(/^seats\[(\d+)\]\[(\w+)\]$/)
//           if(match){
//             const index = parseInt(match[1],10)
//             const field = match[2]
//             if(!seats[index]){
//               seats[index] = {}
//             }
//             seats[index][field] = req.query[element]
//           }
//         })
//         const valid = seats.every((seat) => hall.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat))
//         res.status(200).json({valid})
//       }
//       catch(error){
//         res.status(500).json({error:'Ошибка проверки бронирования'})
//       }
//     },
//     confirmPurchase:async(req,res)=>{
//       try{
//         const { cinemaId,hall,seats,userId } = req.body
//         const now = new Date()
//         const day = String(now.getDate()).padStart(2,'0')
//         const month = String(now.getMonth() + 1).padStart(2,'0')
//         const year = now.getFullYear().toString().slice(2)
//         const date = `${day}.${month}.${year}`
//         if(!cinemaId || !hall || !seats || !userId){
//           return res.status(400).json({ error: "пустые или неопредиленные значения" })
//         }
//         const updateQuery = {
//           $pull:{ 
//             "halls.$[hallElem].reservedSeats":{
//               $or:seats.map((seat)=>({
//                 row: parseInt(seat.row),
//                 seat: parseInt(seat.seat),
//               }))
//             }
//           },
//           $push:{
//             "halls.$[hallElem].boughtSeats":{
//               $each:seats.map((seat)=>({
//                 row: parseInt(seat.row),
//                 seat: parseInt(seat.seat),
//                 userId:userId,
//                 purchasedAt:date
//               }))
//             }
//           }
//         }
//         const result = await TicketFlow.findOneAndUpdate(
//           {
//             _id:cinemaId,
//             "halls.name": hall
//           },
//           updateQuery,
//           {
//             arrayFilters:[{"hallElem.name": hall}],
//             new:true,
//           }
//         )
//         if(!result){
//           return res.status(404).json({ error: "кинотеатр или зал не были найдены"})
//         }
//         res.status(200).json({success:true})
//       }
//       catch(error){
//         res.status(500).json({error: error.message})
//       }
//     },
//     seatsCheck:async(req,res)=>{
//       try {
//         const cinema = await TicketFlow.findById(req.body.cinemaId)
//         const hall = cinema.halls.find((h) => h.name == req.body.hall)
//         const isAvailable = req.body.seats.every((seat) => !hall.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat) && !hall.boughtSeats.some((s) => s.row == seat.row && s.seat == seat.seat))
//         res.json({available: isAvailable})
//       }
//       catch(error){
//         res.status(500).json({error: 'Server error'})
//       }
//     },
//   }
// }