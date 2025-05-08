const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['movie', 'theater', 'concert', 'sport', 'vacation', 'festival', 'exhibition', 'workshop']
    },
    rating: { type: Number,min: 0, max: 5, required: true },
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
    isReviews: { type: Boolean, default: false,required: true },
    reviews: { type: [Object], default: [] },
    isLocation: { type: Boolean, default: false },
    location: String,
    sessions: [{
        time: { type: String, required: true },
        sessionLocation: { type: String, required: true,enum: ['Chaplin MEGA Silk Way','Arman Asia Park','Kinopark 6 Keruencity','Dostar Cinema','Aru Cinema','Arsenal','Chaplin Khan Shatyr','Kinopark 8 IMAX Saryarka','Kinopark 7 IMAX Keruen','Keruen Cinema (Talan Gallery)','Eurasia Cinema7'] },
        hall: { type: String, required: true,enum: ['Зал 1', 'Зал 2', 'Зал 3', 'Зал 4', 'Зал 5','Зал 6']},
        isLanguage: { type: Boolean, default: false },
        sessionLaunguage: { type: String,enum: ['Русс','Кзх','Англ'],default: 'Русс' },
        isSubtitles: { type: Boolean, default: false },
        sessionSubtitles: { type: String },
        isAdultPrice: { type: Boolean, default: false },
        adultPrice: { type: Number },
        isChildPrice: { type: Boolean, default: false },
        childPrice: { type: Number },
        isVIPPrice: { type: Boolean, default: false },
        vipPrice: { type: Number },
    }],
},{timestamps: true})

const TicketFlow = mongoose.model('events',eventSchema)
module.exports = TicketFlow
