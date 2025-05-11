const TicketFlow = require('../../src/models/cinemas')

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
    const hall = cinema.halls.find(h => h.name === req.query.hall)
    
    const valid = req.query.seats.every(seat => 
      hall.reservedSeats.some(s => 
        s.row === seat.row && 
        s.seat === seat.seat &&
        s.userId.toString() === req.user.id
      )
    )
    
    res.status(200).json({ valid })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка проверки бронирования' })
  }
}

const confirmPurchase = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      const cinema = await TicketFlow.findById(req.body.cinemaId).session(session)
      const hall = cinema.halls.find(h => h.name === req.body.hall)

      req.body.seats.forEach(seat => {
        hall.reservedSeats = hall.reservedSeats.filter(s => 
          !(s.row === seat.row && s.seat === seat.seat)
        )
        hall.boughtSeats.push({
          row: seat.row,
          seat: seat.seat,
          userId: req.body.userId,
          purchasedAt: new Date()
        })
      })

      await cinema.save({ session })
      res.status(200).json({ success: true })
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка подтверждения покупки' })
  } finally {
    session.endSession()
  }
}

module.exports = {getAllCinemas,getCinemaById,createCinema,updateCinema,reserveSeats,purchaseSeats,checkReservation,confirmPurchase}