const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./src/routes');
require('dotenv').config()

const app = express();

// Подключение к MongoDB
mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(() => console.log('Успешное подключение к MongoDB'))
.catch(err => console.error('Ошибка подключения:', err));

// Middleware
app.use(express.json());

// Маршруты
app.use('/api/events', eventRoutes)
const cors = require('cors')
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cors({
  origin: 'http://localhost:3000'
}));
// fetch('http://localhost:3002/api/events')
// .then(response => response.json())
// .then(data => console.log(data));