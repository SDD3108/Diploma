const TicketFlow = require('../../src/models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getAllUsers = async (req,res)=>{
    const users = await TicketFlow.find()
    res.status(200).json(users)
}
const getUserById = async (req,res)=>{
    const user = await TicketFlow.findById(req.params.id)
    if(!user){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    res.status(200).json(user)
}

const createUser = async (req,res)=>{
  try{
    const userData = req.body
    // console.log(userData);
    const exists = await TicketFlow.findOne({email:userData.email})
    if(exists){
      return res.status(400).json({message:'email уже используется'})
    }
    const newUser = await TicketFlow.create(userData)
    const payload = {
      userId: newUser._id,
      email: newUser.email
    }
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN},
    )
    console.log(token);
    
    const updatedUser = await TicketFlow.findByIdAndUpdate(
      newUser._id,
      { token },
      { new: true }
    )
   
    res.status(201).json({
      _id: updatedUser._id,
      email: updatedUser.email,
      token: updatedUser.token
    })
  }
  catch(error){
    res.status(500).json({message:'Ошибка создания пользователя' })
  }
}
const createReview = async (req,res)=>{
  try{
    const { eventId, text, grade } = req.body
    const userId = req.params.id

    const user = await TicketFlow.findById(userId)
    if(!user){
      return res.status(404).json({message:'Пользователь не найден'})
    }

    const review = { eventId, text, grade }
    user.reviews.push(review)

    await user.save()
    res.status(201).json({message:'Отзыв успешно добавлен'})
  }
  catch(error){
    res.status(500).json({message:'Ошибка при добавлении отзыва'})
  }
}
const updateUser = async (req,res)=>{
  try {
    const updates = req.body
    updates.isRating = updates.rating !== undefined

    const updatedUser = await TicketFlow.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
    if(!updatedUser){
      return res.status(404).json({ message:'пользователь не найден'})
    }
    res.status(200).json(updatedUser)
  }
  catch(error){
    res.status(500).json({ 
      message: 'ошибка обновления' + error.message 
    })
  }
}

const deleteUser = async (req,res)=>{
  const deletedUser = await TicketFlow.findByIdAndDelete(req.params.id)
  if(!deletedUser){
    return res.status(404).json({ message: 'Событие не найдено' })
  }
  
  res.status(200).json({ message: 'Событие удалено' })
}

module.exports = {getAllUsers,getUserById,createUser,createReview,updateUser,deleteUser,}