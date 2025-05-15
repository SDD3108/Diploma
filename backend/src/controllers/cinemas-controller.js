const TicketFlow = require('../../src/models/cinemas')
const mongoose = require('mongoose')
const getAllCinemas = async (req,res)=>{
    const events = await TicketFlow.find()
    res.status(200).json(events)
}
const getCinemaById = async (req,res)=>{
    const event = await TicketFlow.findById(req.params.id)
    if(!event){
        return res.status(404).json({ message: 'Событие не найдено' })
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
const updateCinema = async (req,res)=>{
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
        { new: true, runValidators: true }
    )
    if(!updatedEvent){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    res.status(200).json(updatedEvent)

}
const reserveSeats = async (req, res) => {
    try {
      const { cinemaId, hall, seats, sessionId } = req.body
      const cinema = await TicketFlow.findByIdAndUpdate(
        cinemaId,
        { $push: { 'halls.$[hall].reservedSeats': { $each: seats } } },
        { 
          arrayFilters: [{ 'hall.name': hall }],
          new: true
        }
      )
      setTimeout(async () => {
        await TicketFlow.findByIdAndUpdate(
          cinemaId,
          { $pull: { 'halls.$[hall].reservedSeats': { $in: seats } } },
          { arrayFilters: [{ 'hall.name': hall }] }
        )
      }, 900000)
  
      res.status(200).json(cinema)
    } catch (error) {
      res.status(500).json({ error: 'Ошибка бронирования' })
    }
}

const purchaseSeats = async (req, res) => {
    try {
      const { cinemaId, hall, seats, sessionId } = req.body
      const cinema = await TicketFlow.findByIdAndUpdate(
        cinemaId,
        { 
          $pull: { 'halls.$[hall].reservedSeats': { $in: seats } },
          $push: { 'halls.$[hall].boughtSeats': { $each: seats } }
        },
        { 
          arrayFilters: [{ 'hall.name': hall }],
          new: true
        }
      )
      
      res.status(200).json(cinema)
    } catch (error) {
      res.status(500).json({ error: 'Ошибка подтверждения покупки' })
    }
}
const checkReservation = async (req, res) => {
  try {
    const cinema = await TicketFlow.findById(req.params.id)
    if (!cinema) {
      return res.status(404).json({ error: 'Кинотеатр не найден' })
    }
    const hall = cinema.halls.find((h) => h.name == req.query.hall)
    if (!hall) {
      return res.status(404).json({ error: 'Зал не найден' })
    }

    const seats = []
    Object.keys(req.query).forEach((key) => {
      const match = key.match(/^seats\[(\d+)\]\[(\w+)\]$/); // Ищем ключи в формате seats[0][row]
      if (match) {
        const index = parseInt(match[1], 10); // Индекс места
        const field = match[2]; // Поле (row, seat, ticketType, price)
        if (!seats[index]) {
          seats[index] = {}; // Создаем объект для этого индекса, если его еще нет
        }
        seats[index][field] = req.query[key] // Заполняем поле
      }
    });
    const valid = seats.every(seat => 
      hall.reservedSeats.some((s) => s.row == seat.row && s.seat == seat.seat)
    )
    res.status(200).json({ valid })
  } catch (error) {
    console.error('Ошибка проверки бронирования:', error)
    res.status(500).json({ error: 'Ошибка проверки бронирования' })
  }
}
const confirmPurchase = async (req, res) => {
  try {
    const { cinemaId, hall, seats, userId } = req.body;
    const now = new Date()
    const day = String(now.getDate()).padStart(2,'0')
    const month = String(now.getMonth() + 1).padStart(2,'0')
    const year = now.getFullYear() // или .toString().slice(2) для 2-значного
    const date = `${day}.${month}.${year}`
    // Проверка наличия обязательных полей
    if (!cinemaId || !hall || !seats || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Подготовка данных для обновления
    const updateQuery = {
      $pull: { 
        "halls.$[hallElem].reservedSeats": {
          $or: seats.map(seat => ({
            row: parseInt(seat.row),
            seat: parseInt(seat.seat)
          }))
        }
      },
      $push: {
        "halls.$[hallElem].boughtSeats": {
          $each: seats.map(seat => ({
            row: parseInt(seat.row),
            seat: parseInt(seat.seat),
            userId: userId,
            purchasedAt: date
          }))
        }
      }
    };

    // Выполнение обновления
    const result = await TicketFlow.findOneAndUpdate(
      { _id: cinemaId, "halls.name": hall },
      updateQuery,
      {
        arrayFilters: [{ "hallElem.name": hall }],
        new: true
      }
    );

    if (!result) {
      return res.status(404).json({ error: "Cinema or hall not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Purchase confirmation error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error" 
    });
  }

  // let session
  // try {
  //   session = await mongoose.startSession()
  //   await session.withTransaction(async()=>{
  //     const cinema = await TicketFlow.findById(req.body.cinemaId).session(session)
  //     console.log('cinema',cinema)
  //     const hall = cinema.halls.find((h) => h.name == req.body.hall)
  //     console.log('hall',hall)

  //     req.body.seats.forEach((seat) => {
  //       console.log('seat',seat)
  //       hall.reservedSeats = hall.reservedSeats.filter((s) => !(s.row === seat.row && s.seat == seat.seat))
  //       hall.boughtSeats.push({
  //         row: seat.row,
  //         seat: seat.seat,
  //         userId: req.body.userId,
  //         purchasedAt: new Date()
  //       })
  //     })

  //     await cinema.save({ session })
  //     res.status(200).json({ success: true })
  //   })
  // }
  // catch(error){
  //   res.status(500).json({ error: 'Ошибка подтверждения покупки' })
  // }
  // finally{
  //   if(session){
  //     session.endSession()
  //   }
  // }
}
// const confirmPurchase = async (req, res) => {
//   try {
//     const { cinemaId, hall, seats, userId } = req.body;

//     // 1. Находим кинотеатр и проверяем существование
//     const cinema = await TicketFlow.findById(cinemaId);
//     if (!cinema) {
//       return res.status(404).json({ error: 'Кинотеатр не найден' });
//     }

//     // 2. Находим нужный зал
//     const hallObj = cinema.halls.find(h => h.name === hall);
//     if (!hallObj) {
//       return res.status(404).json({ error: 'Зал не найден' });
//     }

//     // 3. Проверка резерваций
//     const seatsToPurchase = seats.map(seat => ({
//       row: parseInt(seat.row),
//       seat: parseInt(seat.seat)
//     }));

//     const isAllReserved = seatsToPurchase.every(seat => 
//       hallObj.reservedSeats.some(r => 
//         r.row === seat.row && 
//         r.seat === seat.seat && 
//         r.userId.toString() === userId
//       )
//     );

//     if (!isAllReserved) {
//       return res.status(400).json({ error: 'Некоторые места не забронированы вами' });
//     }

//     // 4. Атомарное обновление
//     const updateResult = await TicketFlow.findOneAndUpdate(
//       { 
//         _id: cinemaId,
//         'halls.name': hall 
//       },
//       {
//         $pull: {
//           'halls.$[hallElem].reservedSeats': {
//             $or: seatsToPurchase.map(seat => ({
//               row: seat.row,
//               seat: seat.seat
//             }))
//           }
//         },
//         $push: {
//           'halls.$[hallElem].boughtSeats': {
//             $each: seatsToPurchase.map(seat => ({
//               row: seat.row,
//               seat: seat.seat,
//               userId: userId,
//               purchasedAt: new Date()
//             }))
//           }
//         }
//       },
//       {
//         arrayFilters: [{ 'hallElem.name': hall }],
//         new: true
//       }
//     );

//     if (!updateResult) {
//       return res.status(500).json({ error: 'Ошибка обновления данных' });
//     }

//     res.status(200).json({ 
//       success: true,
//       updatedCinema: updateResult
//     });

//   } catch (error) {
//     console.error('Ошибка подтверждения покупки:', error);
//     res.status(500).json({ 
//       error: error.message || 'Внутренняя ошибка сервера' 
//     });
//   }
// };

module.exports = {getAllCinemas,getCinemaById,createCinema,updateCinema,reserveSeats,purchaseSeats,checkReservation,confirmPurchase}