const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
const eventRoutes = require('./src/routes/events')
const cinemaRoutes = require('./src/routes/cinemas')
const userRoutes = require('./src/routes/users')
const nodemailer = require('nodemailer')
require('dotenv').config()
const cors = require('cors')
const path = require('path')
const TicketFlow = require('../backend/src/models/cinemas')

const app = express()
const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  path: '/socket.io',
})

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      html
    })
    console.log('Email sent:', info.messageId)
    res.status(200).json({ message: 'Email sent', id: info.messageId })
  } catch (err) {
    console.error('Error sending email:', err)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(async () => {
    console.log('Успешное подключение к MongoDB')
    const cron = require('node-cron');
    const TicketFlow = require('./src/models/cinemas')
    cron.schedule('*/5 * * * *', async ()=>{
      try{
        const cinemas = await TicketFlow.find()
        const now = new Date()

        for(const cinema of cinemas){
          for(const hall of cinema.halls){
            const expiredReservations = hall.reservedSeats.filter(
              seat => now - seat.reservedAt > 900000
            )
            if(expiredReservations.length > 0){
              await TicketFlow.findByIdAndUpdate(
                cinema._id,
                {
                  $pull: {
                    'halls.$[hall].reservedSeats': {
                      $in: expiredReservations.map((s) => ({ row: s.row, seat: s.seat }))
                    }
                  }
                },
                { arrayFilters: [{ 'hall.name': hall.name }] }
              )
            }
          }
        }
      }
      catch(error){
        console.error('Ошибка очистки броней:', error)
      }
    })
})
.catch((err) => console.error('Ошибка подключения к MongoDB:', err))

// Модель Session
const AutoIncrement = require('mongoose-sequence')(mongoose);
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
sessionSchema.plugin(AutoIncrement, { inc_field: 'cinemaId' });
const Session = mongoose.model('Session', sessionSchema);
Session.createIndexes({ cinemaId: 1 }, { unique: true });

// Socket.IO события
io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);

  socket.on('reserveSeat', async (data) => {
    try {
      const cinema = await TicketFlow.findById(data.cinemaId);
      const hall = cinema.halls.find((h) => h.name === data.hall);

      if (!hall) return;

      const isReserved = hall.reservedSeats.some(
        (s) => s.row === data.seat.row && s.seat === data.seat.seat
      );
      const isBought = hall.boughtSeats.some(
        (s) => s.row === data.seat.row && s.seat === data.seat.seat
      );

      if (isReserved || isBought) {
        socket.emit('seatUnavailable', { seat: data.seat });
        return;
      }

      hall.reservedSeats.push({ ...data.seat, reservedAt: new Date() });
      await cinema.save();

      io.emit('seatReserved', cinema);
    } catch (error) {
      console.error('Ошибка резервирования места:', error);
    }
  });

  socket.on('cancelReservation', async (data) => {
    try {
      const cinema = await TicketFlow.findById(data.cinemaId);
      const hall = cinema.halls.find((h) => h.name === data.hall);

      if (!hall) return;

      hall.reservedSeats = hall.reservedSeats.filter(
        (s) => !(s.row === data.seat.row && s.seat === data.seat.seat)
      );
      await cinema.save();

      io.emit('seatReserved', cinema);
    } catch (error) {
      console.error('Ошибка отмены резервации:', error);
    }
  });

  socket.on('confirmPurchase', async (data) => {
    try {
      const cinema = await TicketFlow.findById(data.cinemaId);
      const hall = cinema.halls.find((h) => h.name === data.hall);

      if (!hall) return;

      hall.reservedSeats = hall.reservedSeats.filter(
        (s) => !(s.row === data.seat.row && s.seat === data.seat.seat)
      );
      hall.boughtSeats.push(data.seat);
      await cinema.save();

      io.emit('seatPurchased', cinema);
    } catch (error) {
      console.error('Ошибка подтверждения покупки:', error);
    }
  });
});

// Маршруты
app.use('/api/events', eventRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/users', userRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});