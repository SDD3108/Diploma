const TicketFlow = require('../../src/models/events');

// Получить все события (для API)
const getAllEvents = async (req, res) => {
    try {
        const events = await TicketFlow.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Ошибка при получении событий:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить одно событие по ID
const getEventById = async (req, res) => {
    try {
        const event = await TicketFlow.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Ошибка при получении события:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Создать новое событие
const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        // Автоматически устанавливаем isRating если передан rating
        if (eventData.rating !== undefined) {
            eventData.isRating = true;
        }

        const newEvent = new TicketFlow(eventData);
        await newEvent.save();
        
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Ошибка при создании события:', error);
        res.status(400).json({ message: 'Неверные данные', error: error.message });
    }
};

// Обновить событие
const updateEvent = async (req, res) => {
    try {
        const updates = req.body;
        
        // Обновляем isRating в зависимости от наличия rating
        if (updates.rating !== undefined) {
            updates.isRating = true;
        } else if (updates.rating === null) {
            updates.isRating = false;
        }

        const updatedEvent = await TicketFlow.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Ошибка при обновлении события:', error);
        res.status(400).json({ message: 'Неверные данные', error: error.message });
    }
};

// Удалить событие
const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await TicketFlow.findByIdAndDelete(req.params.id);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Событие не найдено' });
        }
        
        res.status(200).json({ message: 'Событие удалено' });
    } catch (error) {
        console.error('Ошибка при удалении события:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};