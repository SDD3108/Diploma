const TicketFlow = require('../../src/models/events')

const getAllEvents = async (req,res)=>{
    const events = await TicketFlow.find()
    res.status(200).json(events)
}
const getEventById = async (req,res)=>{
    const event = await TicketFlow.findById(req.params.id)
    if(!event){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    res.status(200).json(event)
}

const createEvent = async (req,res)=>{
    const eventData = req.body
    if(eventData.rating !== undefined){
        eventData.isRating = true
    }

    const newEvent = new TicketFlow(eventData)
    await newEvent.save()

    res.status(201).json(newEvent)
}
const createReview = async (req,res)=>{
    // console.log(req.body)
    const { userId, text, grade } = req.body
    const eventId = req.params.id

    const event = await TicketFlow.findById(eventId)
    if(!event){
        return res.status(404).json({ message: 'Событие не найдено' })
    }

    const newReview = {
        userId,
        text,
        grade,
    }

    event.reviews.push(newReview)
    await event.save()

    res.status(201).json(newReview)
}
const updateEvent = async (req,res)=>{
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

const deleteEvent = async (req,res)=>{
    const deletedEvent = await TicketFlow.findByIdAndDelete(req.params.id)
    if(!deletedEvent){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    
    res.status(200).json({ message: 'Событие удалено' })
}

module.exports = {getAllEvents,getEventById,createEvent,createReview,updateEvent,deleteEvent,}