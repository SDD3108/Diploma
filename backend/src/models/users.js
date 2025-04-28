const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPhoneNumber: { type: Boolean, default: false },
    phoneNumber: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    isDateOfBirth: { type: Boolean, default: false },
    dateOfBirth: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    reviews:[{
        eventId:{type:String},
        text:{type:String},
        grade:{type:Number,min:0,max:5}
    }]
},{timestamps: true})

const TicketFlow = mongoose.model('users',userSchema)
module.exports = TicketFlow
