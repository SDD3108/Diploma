const mongoose = require('mongoose');
const Schema = mongoose.Schema

const eventSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['movie', 'theater', 'concert', 'sport', 'vacation', 'festival', 'exhibition', 'workshop','action']
    },
    rating: { type: Number },
    isRating: { type: Boolean, default: false },
    age: { type: Number, required: true },
    genre: { 
        type: String, 
        required: true,
        enum: ['anime', 'biographical', 'action', 'war', 'detective', 'childrens', 'documentary', 'drama','historical','comedy',
            'concert','short','crime','melodrama','mysticism','cartoon','musical','scientific','noir','adventure','reality show',
            'family','sports','talk show','thriller','horror','sci-fi','fantasy',
        ]
        
    },
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isDetails: { type: Boolean, default: false },
    details: {
        engTitle: String,
        duration: Number,
        releaseDate: String,
        production: String,
        director: String
    },
    isRoles: { type: Boolean, default: false },
    roles: [String],
    reviews: { type: [Object], default: [] },
    isLocation: { type: Boolean, default: false },
    location: String
},{timestamps: true})

const TicketFlow = mongoose.model('events',eventSchema)
module.exports = TicketFlow
