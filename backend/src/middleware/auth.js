const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = (req,res,next)=>{
  if(!req.headers.authorization){
    return res.status(401).json({message: 'Отсутствует токен авторизации'})
  }
  try{
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userData = decoded
    next()
  }
  catch(error){
    let message = 'Ошибка аутентификации'
    if(error.name == 'TokenExpiredError'){
      message = 'Срок действия токена истёк'
    }
    else if(error.name == 'JsonWebTokenError'){
      message = 'Неверный формат токена'
    }
    return res.status(401).json({message})
  }
}