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
    const userData = req.body
    if(userData.rating !== undefined){
        userData.isRating = true
    }
    const newUser = new TicketFlow(userData)
    await newUser.save()
    res.status(201).json(newUser)
}

const updateUser = async (req,res)=>{
    const updates = req.body
    if(updates.rating !== undefined){
        updates.isRating = true
    }
    else if(updates.rating == null){
        updates.isRating = false
    }

    const updatedUser = await TicketFlow.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    )
    if(!updatedUser){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    res.status(200).json(updatedUser)

}

const deleteUser = async (req,res)=>{
    const deletedUser = await TicketFlow.findByIdAndDelete(req.params.id)
    if(!deletedUser){
        return res.status(404).json({ message: 'Событие не найдено' })
    }
    
    res.status(200).json({ message: 'Событие удалено' })
}

module.exports = {getAllUsers,getUserById,createUser,updateUser,deleteUser,}