const TicketFlow = require('../../src/models/users')
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
    // const userData = req.body
    // if(userData.rating !== undefined){
    //     userData.isRating = true
    // }
    // const newUser = new TicketFlow(userData)
    // await newUser.save()
    // res.status(201).json(newUser)
    try {
        const userData = req.body
        const exists = await TicketFlow.findOne({email:userData.email})
        if(exists){
          return res.status(400).json({message:'email уже используется'})
        }
        const newUser = await TicketFlow.create(userData)
        res.status(201).json(newUser)
      }
      catch(error){
        res.status(500).json({message:'Ошибка создания пользователя' })
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
          return res.status(404).json({ message: 'Пользователь не найден' })
        }

        res.status(200).json(updatedUser)
      }
      catch(error){
        res.status(500).json({ 
          message: 'Ошибка обновления: ' + error.message 
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

module.exports = {getAllUsers,getUserById,createUser,updateUser,deleteUser,}