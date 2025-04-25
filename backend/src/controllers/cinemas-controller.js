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
module.exports = {getAllCinemas,getCinemaById,createCinema,updateCinema}