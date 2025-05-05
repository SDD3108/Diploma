const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const secketKey = process.env.JWT_SECRET
// const tokenTime = process.env.JWT_EXPIRES_IN

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPhoneNumber: { type: Boolean, default: false },
    phoneNumber: { type: String, required: false },
    avatar: {type: String,required:false},
    isAdmin: { type: Boolean, default: false },
    isDateOfBirth: { type: Boolean, default: false },
    dateOfBirth: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    reviews:[{
        eventId:{type:String},
        text:{type:String},
        grade:{type:Number,min:0,max:5}
    }], 
    mode:{type:String,default:'Светлая',required: false,unique:['Светлая','Тёмная']},
    token:{type:String, required:false,},
    ownDescription: {type:String,required:false},
},{timestamps: true})

const TicketFlow = mongoose.model('users',userSchema)
module.exports = TicketFlow
