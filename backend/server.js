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

mongoose.connect(`mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@cluster0.pirt6.mongodb.net/TicketFlow?retryWrites=true&w=majority`)
.then(() => console.log('Успешное подключение к MongoDB'))
.catch(err => console.error('Ошибка подключения:', err));


// выходит проблема дубликации ключа
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
  // что делает весь код выше?
// он создает новую схему для сессий и добавляет автоинкрементный id для каждой новой сессии
// и сохраняет новую сессию в базу данных
// и добавляет автоинкрементный id для каждой новой сессии
// и сохраняет новую сессию в базу данных
// получается после первого раза можно убрать newSession?
// да, можно убрать newSession, но тогда id будет одинаковым для всех объектов в массиве sessions
// и будет ошибка при сохранении в базу данных newSession?
// да, будет ошибка, потому что id будет одинаковым для всех объектов в массиве sessions
// а что еще надо убрать?
// надо убрать newSession и оставить только Session.createIndexes({ cinemaId: 1 }, { unique: true });
// а что делает Session.createIndexes({ cinemaId: 1 }, { unique: true });?
// оно создает уникальный индекс для поля cinemaId в коллекции sessions, чтобы избежать дублирования id

// и что оно сделает если я запушу сервер?
// оно создаст новый id для каждого нового объекта в массиве sessions?
// понял,а мне это всегда должно быть рабочим? или после первого раза можно закоментить?
// оно всегда должно быть рабочим, чтобы каждый раз при создании нового объекта в массиве sessions id увеличивался на 1
// и не повторялся, а если закоментить, то id будет одинаковым для всех объектов в массиве sessions
// и будет ошибка при сохранении в базу данных newSession?
// да, будет ошибка, потому что id будет одинаковым для всех объектов в массиве sessions
// а что еще надо убрать?



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
//  сделай обьект с моими полями данных из events.js и сделай правдаподобные данные для них,и рабочию картинку,и укажи цену в тенге,и время без PM и AM
// fetch('http://localhost:3002/api/events', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(
//   {
//     type: 'movie',
//     rating: 5,
//     isRating: true,
//     age: 18,
//     genre: 'action',
//     image: 'https://example.com/image.jpg',
//     title: 'Example Movie',
//     description: 'This is an example movie description.',
//     isDetails: true,
//     details: {
//       engTitle: 'Example Movie Title',
//       duration: 120,
//       releaseDate: '2023-01-01',
//       production: 'Example Production Company',
//       director: 'John Doe'
//     },
//     isRoles: true,
//     roles: ['Actor 1', 'Actor 2'],
//     reviews: [],
//     isLocation: true,
//     location: 'Example Location',
//     sessions: [
//       {
//         time: '12:00',
//         sessionLocation: 'Main Hall',
//         hall: 'Hall 1',
//         isLanguage: true,
//         sessionLaunguage: 'Русс',
//         isSubtitles: false,
//         sessionSubtitles: '',
//         isAdultPrice: true,
//         adultPrice: 1000,
//         isChildPrice: true,
//         childPrice: 500,
//         isVIPPrice: true,
//         vipPrice: 1500,
//       }
//     ]
//   }
//   )
// })
// .then(response => response.json())
// .then(data => console.log(data));