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
    newUser.messages.push({
      isRead: false,
      title: 'Авторизация подтверждена',
      briefDescription: `Уважаемый ${newUser.name}, вы успешно авторизованы в системе.`,
      description: `Здравствуйте, ${newUser.name}!  
Благодарим вас за то, что воспользовались нашим сервисом. Ваша учетная запись активирована, и вы теперь можете полноценно использовать все возможности платформы. Если у вас возникнут какие-либо вопросы, пожалуйста, обратитесь в нашу службу поддержки.`,
      date: `${new Date()}`,
    })
    await newUser.save()
    const payload = {
      userId: newUser._id,
      email: newUser.email
    }
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN},
    )
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
const addPurchase = async (req, res) => {
  try{
    const { userId, purchase } = req.body
    const user = await TicketFlow.findByIdAndUpdate(
      userId,
      { $push: { purchasedTickets: purchase }},
      { new: true }
    )
    if(!user){
      return res.status(404).json({ error: 'Пользователь не найден' })
    }
    res.status(200).json({success:true})
  }
  catch(error){
    res.status(500).json({error:'Ошибка сохранения покупки'})
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
const deleteMessage = async (req,res)=>{
  try{
    const messageId = req.params.id
    const userId = req.body.userId

    const user = await TicketFlow.findById(userId)
    if(!user){
      return res.status(404).json({message:'Пользователь не найден'})
    }

    const updatedMessages = user.messages.filter(message => message._id.toString() !== messageId)
    user.messages = updatedMessages

    await user.save()
    res.status(200).json({message:'Сообщение успешно удалено'})
  }
  catch(error){
    res.status(500).json({message:'Ошибка при удалении сообщения'})
  }
}
const updateUserAvatar = async (req, res) => {
  try {
    const user = await TicketFlow.findById(req.params.id)
    if(!user){
      return res.status(404).json({message:'пользователь не найден'})
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    user.isAvatar = true;
    await user.save();

    res.json({ 
      avatarUrl: user.avatar,
      message: 'Аватар успешно обновлён' 
    });
  } catch (error) {
    console.log('error',error)
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}
const deleteUserAvatar = async (req, res) => {
  try {
    const user = await TicketFlow.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.avatar = '';
    user.isAvatar = false;
    await user.save();

    res.json({ message: 'Аватар успешно удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
}
const updateTempPassword = async (req, res) => {
  try {
    const { email, tempPassword } = req.body;
    
    // Валидация входящих данных
    if (!email || !tempPassword) {
      return res.status(400).json({ message: 'Необходимы email и временный пароль' });
    }

    const user = await TicketFlow.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    user.tempPassword = tempPassword;
    await user.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления временного пароля:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при обновлении временного пароля',
      error: error.message 
    });
  }
}
const changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body
    const user = await User.findById(userId)
    
    if(user.tempPassword === null){
      return res.status(400).json({message: 'Password already changed'})
    }

    user.password = newPassword
    user.tempPassword = null
    await user.save()
    
    res.status(200).json({success: true})
  }
  catch(error){
    console.error('Ошибка сервера при измении пароля', error);
    res.status(500).json({ 
      message: 'Ошибка сервера при измении пароля',
      error: error.message 
    })
  }
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  createReview,
  updateUser,
  deleteUser,
  addPurchase,
  deleteMessage,
  updateUserAvatar,
  deleteUserAvatar,
  updateTempPassword,
  changePassword
}