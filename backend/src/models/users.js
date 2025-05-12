const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('dotenv').config()

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPhoneNumber: { type: Boolean, default: false },
    phoneNumber: { type: String, required: false },
    isAvatar:{type:Boolean,required:false,default:false},
    avatar: {type: String,required:false,default:''},
    isAdmin: { type: Boolean, default: false },
    reviews:[{
        eventId:{type:String},
        text:{type:String},
        grade:{type:Number,min:0,max:5}
    }],
    purchasedTickets:[{
        date:{type:String,default: Date.now},
        eventId:{type:String,required: true},
        sessionId:{type:String,required: true},
        ticketPrice:{type:Number,required: true},
        ticketCount:{type:Number,required: true},
        ticketArray:[{
            place:{type:String,required: true},
            ticketType:{type:String,enum:['VIP','Adult','Child'],default:'Adult'},
        }],
    }],
    mode:{type:String,default:'Светлая',required: false,unique:['Светлая','Тёмная']},
    token: { type: String },
    ownDescription: {type:String,required:false},
    messages:[{
        isRead:{type:Boolean,default:false,required: true},
        title:{type:String,required:true},
        briefDescription:{type:String,required:true},
        description:{type:String,required:true},
        date:{type:String,default: Date.now}
    }],
},{timestamps: true})

const TicketFlow = mongoose.model('users',userSchema)
module.exports = TicketFlow
