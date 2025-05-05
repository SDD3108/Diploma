const express = require('express')
const mongoose = require('mongoose')
const eventRoutes = require('./src/routes/events')
const cinemaRoutes = require('./src/routes/cinemas')
const userRoutes = require('./src/routes/users')

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
app.use('/api/users', userRoutes)
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
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
//   body: JSON.stringify({})
// })
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('http://localhost:3002/api/cinemas',{
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// body: JSON.stringify()
// })
// .then(response => response.json())
// .then(data => console.log(data));

// fetch('http://localhost:3002/api/users')
// .then(response => response.json())
// .then(data => console.log(data));

