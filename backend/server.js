const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./src/routes');
require('dotenv').config()
const cors = require('cors')

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Подключение к MongoDB
mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(() => console.log('Успешное подключение к MongoDB'))
.catch(err => console.error('Ошибка подключения:', err));

// Middleware
app.use(express.json());

// Маршруты
app.use('/api/events', eventRoutes)
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

// fetch('http://localhost:3002/api/events', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(
    
//   )
// })
// .then(response => response.json())
// .then(data => console.log(data));