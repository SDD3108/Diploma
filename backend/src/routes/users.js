const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users-controller')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, 'uploads/avatars/')
  },
  filename:(req,file,cb)=>{
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,`${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {fileSize: 2 * 1024 * 1024 },
  fileFilter:(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
      cb(null, true)
    }
    else{
      cb(new Error('Недопустимый тип файла'),false)
    }
  }
})

router.get('/', usersController.getAllUsers)
router.get('/:id', usersController.getUserById)
router.post('/', usersController.createUser)
router.post('/:id/reviews', usersController.createReview)
router.put('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)
router.post('/add-purchase', usersController.addPurchase)
router.post('/messages/:id', usersController.deleteMessage)
router.post('/:id/avatar',upload.single('avatar'), usersController.updateUserAvatar)
router.delete('/:id/avatar',usersController.deleteUserAvatar) 
router.patch('/update-temp-password', usersController.updateTempPassword)
router.patch('/change-password', usersController.changePassword)
router.post('/:id/add-message', usersController.addMessage)

module.exports = router