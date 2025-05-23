const mongoose = require('mongoose')
const Schema = mongoose.Schema


const cinemasSchema = new Schema({
    cinemaName: { type: String, required: true,enum: [
        'Chaplin MEGA Silk Way',
        'Arman Asia Park',
        'Kinopark 6 Keruencity',
        'Dostar Cinema',
        'Aru Cinema',
        'Arsenal',
        'Chaplin Khan Shatyr',
        'Kinopark 8 IMAX Saryarka',
        'Kinopark 7 IMAX Keruen',
        'Keruen Cinema (Talan Gallery)',
        'Eurasia Cinema7'
    ]},
    cinemaAddress: { type: String, required: true },
    cinemaRate: { type: Number,required: true,default:5,min: 0,max: 5 }, 
    reviewsCount: { type: Number,default: 0 },
    reviews: [{
        userId: { type: String,required: true },
        text: { type: String,required: true },
        grade: { type: Number,required: true,min: 0,max: 5 },
    }],
    halls: [{
        name: { type: String,required: true,enum: ['Зал 1', 'Зал 2', 'Зал 3', 'Зал 4', 'Зал 5','Зал 6'] },
        capacity: { type: Number,required: true },
        rows: { type: Number,required: true,min:4,max:14 },
        seatsPerRow: { type: Number,required: true,min:4,max:20 },
        reservedSeats:[{
            row: Number,
            seat: Number,
            reservedAt: { type: Date, default: Date.now },
            userId: { type: String,required:true}
        }],
        boughtSeats:[{
            row: Number,
            seat: Number,
            purchasedAt: { type: String,required:true },
            userId: { type: String,required:true}
        }],
        isVipSeats: { type: Boolean,default: false },
        VIPSeats:[{
            row:{type:Number,default:5},
            seat:{type:Number,default:5},
        }],
    }]
},{timestamps: true})

const TicketFlow = mongoose.model('cinemas',cinemasSchema)
module.exports = TicketFlow