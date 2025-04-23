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
//     {
//       type: 'movie',
//       rating: 9.1,
//       isRating: true,
//       age: 16,
//       genre: 'action',
//       image: 'https://example.com/image.jpg',
//       title: 'Фнаф 2',
//       description: 'На этот раз вселенная «Патруля» оказывается в области Абай',
//       isDetails: true,
//       details: {
//         engTitle: 'Fnaf 2',
//         duration: 110,
//         releaseDate: '31.08.2007',
//         production: 'Казахстан',
//         director: 'режиссер',
//       },
//       isRoles: true,
//       roles: [
//         'Рамазан Амантай',
//         'Жақсылық Айтқұрман',
//         'Жасұлан Айтенов',
//         'Шарифбек Закиров',
//         'Әльмахан Шахмардан',
//         'Бақытгүл Серікбаева',
//       ],
//       reviews: [],
//       isLocation: true,
//       location: 'Бар "skvôt."',
//       sessions: [
//         {
//           id: Date.now(),
//           time: '12:00',
//           sessionLocation: 'Кинотеатр "Арман"',
//           hall: 'Зал 2',
//           isLanguage: true,
//           sessionLaunguage: 'Рус',
//           isSubtitles: true,
//           sessionSubtitles: 'Кзх',
//           isAdultPrice: true,
//           adultPrice: 1000,
//           isChildPrice: true,
//           childPrice: 500,
//           isVIPPrice: true,
//           vipPrice: 1500,
//         },
//         {
//           id: Date.now(),
//           time: '12:10',
//           sessionLocation: 'Chaplin MEGA Silk Way',
//           hall: 'Зал 1',
//           isLanguage: true,
//           sessionLaunguage: 'Кзх',
//           isSubtitles: true,
//           sessionSubtitles: 'Рус',
//           isAdultPrice: true,
//           adultPrice: 1000,
//           isChildPrice: true,
//           childPrice: 500,
//           isVIPPrice: true,
//           vipPrice: 1500,
//         },
//         {
//           id: Date.now(),
//           time: '12:15',
//           sessionLocation: 'Chaplin MEGA Silk Way',
//           hall: 'Зал 3',
//           isLanguage: true,
//           sessionLaunguage: 'Кзх',
//           isSubtitles: true,
//           sessionSubtitles: 'Рус',
//           isAdultPrice: true,
//           adultPrice: 1000,
//           isChildPrice: true,
//           childPrice: 500,
//           isVIPPrice: true,
//           vipPrice: 1500,
//         },
//         {
//           id: Date.now(),
//           time: '12:20',
//           sessionLocation: 'Chaplin MEGA Silk Way',
//           hall: 'Зал 4',
//           isLanguage: true,
//           sessionLaunguage: 'Кзх',
//           isSubtitles: true,
//           sessionSubtitles: 'Рус',
//           isAdultPrice: true,
//           adultPrice: 1000,
//           isChildPrice: true,
//           childPrice: 500,
//           isVIPPrice: true,
//           vipPrice: 1500,
//         },
//       ],
//     }

//   )
// })
// .then(response => response.json())
// .then(data => console.log(data));