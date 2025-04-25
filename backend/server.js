const express = require('express')
const mongoose = require('mongoose')
const eventRoutes = require('./src/routes/events')
const cinemaRoutes = require('./src/routes/cinemas')
// const cinemaRoutes = require('./src/routes/');
require('dotenv').config()
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(() => console.log('Успешное подключение к MongoDB'))
.catch(err => console.error('Ошибка подключения:', err))


// выходит проблема дубликации ключа
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
});

sessionSchema.plugin(AutoIncrement, { inc_field: 'cinemaId' })

const Session = mongoose.model('Session', sessionSchema)
Session.createIndexes({ cinemaId: 1 },{ unique: true })
app.use(express.json())

// Маршруты
app.use('/api/events', eventRoutes)
app.use('/api/cinemas', cinemaRoutes)
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
app.use(cors({
  origin: 'http://localhost:3000'
}));
// fetch('http://localhost:3002/api/events')
// .then(response => response.json())
// .then(data => console.log(data));
//  сделай обьект с моими полями данных из events.js и сделай правдаподобные данные для них,и рабочию картинку,и укажи цену в тенге,и время без PM и AM
// fetch('http://localhost:3002/api/events', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({})
// })
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('http://localhost:3002/api/cinemas',{
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
  // body: JSON.stringify({
  //   cinemaName: 'Chaplin MEGA Silk Way',
  //   cinemaAddress: 'г. Алматы, пр. Достык, 4',
  //   cinemaRate: 4.5,
  //   reviewsCount: 120,
  //   reviews:[
  //     { user: 'User1', text: 'Отличный кинотеатр!', grade: 5 },
  //     { user: 'User2', text: 'Хорошее качество изображения.', grade: 4 },
  //   ],
  //   halls: [
  //     {
  //       name: 'Зал 1',
  //       capacity: 100,
  //       rows: 10,
  //       seatsPerRow: 10,
  //       reservedSeats: [
  //         { row: 1, seat: 1 },
  //         { row: 2, seat: 2 },
  //       ],
  //     },
  //     {
  //       name: 'Зал 2',
  //       capacity: 80,
  //       rows: 8,
  //       seatsPerRow: 10,
  //       reservedSeats: [],
  //     },
  //   ],
  // })
// })
// .then(response => response.json())
// .then(data => console.log(data));

