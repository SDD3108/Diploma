const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
const eventRoutes = require('./src/routes/events')
const cinemaRoutes = require('./src/routes/cinemas')
const userRoutes = require('./src/routes/users')
require('dotenv').config()
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }
})

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())

const socket = io('http://localhost:3002',{
  path: "/socket.io",
  transports: ['websocket', 'polling'],
})

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(async() => {
  console.log('Успешное подключение к MongoDB')
  const cron = require('node-cron')
    const TicketFlow = require('./src/models/cinemas') // Импорт модели

    cron.schedule('*/5 * * * *', async () => {
      try {
        const cinemas = await TicketFlow.find()
        const now = new Date()
        
        for (const cinema of cinemas) {
          for (const hall of cinema.halls) {
            const expiredReservations = hall.reservedSeats.filter(
              seat => now - seat.reservedAt > 900000
            )
            
            if (expiredReservations.length > 0) {
              await TicketFlow.findByIdAndUpdate(
                cinema._id,
                {
                  $pull: { 
                    'halls.$[hall].reservedSeats': { 
                      $in: expiredReservations.map(s => ({ row: s.row, seat: s.seat }))
                    } 
                  }
                },
                { arrayFilters: [{ 'hall.name': hall.name }] }
              )
            }
          }
        }
      } catch (error) {
        console.error('Ошибка очистки броней:', error)
      }
    })
})
.catch(err => console.error('Ошибка подключения:', err))

const AutoIncrement = require('mongoose-sequence')(mongoose)
const sessionSchema = new mongoose.Schema({
  time: { type: String, required: true },
  sessionLocation: { type: String, required: true },
  hall: { type: String, required: true },
  isLanguage: { type: Boolean, default: false },
  sessionLaunguage: { type: String, enum: ['Русс', 'Кзх', 'Англ'], default: 'Русс' },
  isSubtitles: { type: Boolean, default: false },
  sessionSubtitles: { type: String },
  isAdultPrice: { type: Boolean, default: false },
  adultPrice: { type: Number },
  isChildPrice: { type: Boolean, default: false },
  childPrice: { type: Number },
  isVIPPrice: { type: Boolean, default: false },
  vipPrice: { type: Number }
})
sessionSchema.plugin(AutoIncrement, { inc_field: 'cinemaId' })
const Session = mongoose.model('Session', sessionSchema)
Session.createIndexes({ cinemaId: 1 },{ unique: true })

io.on('connection',(socket)=>{
  console.log(socket.id)
  socket.on('joinSession',(sessionId)=>{
    socket.join(sessionId)
  })
  socket.on('reserveSeat', async (data)=>{
    try {
      const cinema = await mongoose.model('cinemas').findOneAndUpdate(
        {'halls.name':data.hall},
        {$push:{
          'halls.$[hall].reservedSeats': data.seat
        }},
        { 
          arrayFilters:[{
            'hall.name': data.hall
          }],
          new:true
        }
      )
      io.to(data.sessionId).emit('seatReserved',{
        seat: data.seat,
        sessionId: data.sessionId
      })
    }
    catch(error){
      console.error('ошибка бронирования', error)
    }
  })
  socket.on('confirmPurchase', async (data) => {
  try{
    const cinema = await mongoose.model('cinemas').findOneAndUpdate(
      { 'halls.name': data.hall },
      { 
        $pull: { 'halls.$[hall].reservedSeats': { row: data.seat.row, seat: data.seat.seat } },
        $push: { 'halls.$[hall].boughtSeats': data.seat }
      },
      { 
        arrayFilters: [{ 'hall.name': data.hall }],
        new: true
      }
    )
    
    io.to(data.sessionId).emit('seatPurchased', {
      seat: data.seat,
      sessionId: data.sessionId
    })
  }
  catch(error){
    console.error('Ошибка подтверждения покупки:', error)
  }
  })
  socket.on('checkSeat', async (data, callback) => {
    try {
        const cinema = await Cinema.findById(data.cinemaId);
        const hall = cinema.halls.find(h => h.name === data.hall);
        
        const isReserved = hall.reservedSeats.some(s => 
            s.row === data.row && s.seat === data.seat
        );
        
        const isBought = hall.boughtSeats.some(s => 
            s.row === data.row && s.seat === data.seat
        );

        callback({ available: !isReserved && !isBought });
    } catch (err) {
        callback({ available: false });
    }
})
})

// Маршруты
app.use('/api/events', eventRoutes)
app.use('/api/cinemas', cinemaRoutes)
app.use('/api/users', userRoutes)
// 
const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
})
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
// fetch('http://localhost:3002/api/events', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//    заполни правдаподобными данными
//     type: 'movie',
//     rating: 4.5,
//     isRating: true,
//     age: 18,
//     genre: 'action',
//     image: 'https://example.com/image.jpg',
//     title: 'Example Movie',
//     description: 'This is an example movie description.',
//     isDetails: true,
//     details: {
//       engTitle: 'Example Movie',
//       duration: 120,
//       releaseDate: '2023-01-01',
//       production: 'Example Production',
//       director: 'John Doe'
//     },
//     isRoles: true,
//     roles: ['Actor 1', 'Actor 2'],
//     isReviews: true,
//     reviews: [{
//       userId: '12345',
//       text: 'Great movie!',
//       grade: 5
//     }],
//     isLocation: true,
//     location: 'Example Location',
//     sessions: [{
//       time: '12:00',
//       sessionLocation: 'Chaplin MEGA Silk Way',
//       hall: 'Зал 1',
//       isLanguage: true,
//       sessionLaunguage: 'Русс',
//       isSubtitles: true,
//       sessionSubtitles: 'Кзх',
//       isAdultPrice: true,
//       adultPrice: 1000,
//       isChildPrice: true,
//       childPrice: 500,
//       isVIPPrice: true,
//       vipPrice: 1500
//     }]
//   })
// })
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('http://localhost:3002/api/cinemas/680b2f4f09aa64393176f801',{
//   method: 'DELETE',
// })
//   .then(response => response.json())
//   .then(data => console.log(data));

// fetch('http://localhost:3002/api/users')
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('http://localhost:3002/api/cinemas',{
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     cinemaName: 'Chaplin MEGA Silk Way',
//     cinemaAddress: 'г. Нур-Султан, ТРЦ MEGA Silk Way',
//     cinemaRate: 4.8,
//     reviewsCount: 12,
//     reviews: [
//       {
//         user: '1231',
//         text: 'Отличный кинотеатр, рекомендую!',
//         grade: 5,
//       },
//       {
//         user: '1232',
//         text: 'Хороший звук и удобные кресла.',
//         grade: 4,
//       },
//     ],
//     halls: [
//       {
//         name: 'Зал 1',
//         capacity: 100,
//         rows: 10,
//         seatsPerRow: 10,
//         reservedSeats: [
//           { row: 3, seat: 5 },
//           { row: 4, seat: 6 },
//         ],
//         boughtSeats: [
//           { row: 2, seat: 3 },
//           { row: 5, seat: 8 },
//         ],
//         isVipSeats: true,
//         VIPSeats: [
//           { row: 1, seat: 1 },
//           { row: 1, seat: 2 },
//         ],
//       },
//       {
//         name: 'Зал 2',
//         capacity: 80,
//         rows: 8,
//         seatsPerRow: 10,
//         reservedSeats: [
//           { row: 2, seat: 4 },
//           { row: 6, seat: 7 },
//         ],
//         boughtSeats: [
//           { row: 3, seat: 2 },
//           { row: 7, seat: 9 },
//         ],
//         isVipSeats: false,
//         VIPSeats: [],
//       },
//     ],
//   })
// })
// .then(response => response.json())
// .then(data => console.log(data));