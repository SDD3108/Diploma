const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const cinemaController = require('../controllers/cinemas-controller')

router.get('/', cinemaController.getAllCinemas)
router.get('/:id', cinemaController.getCinemaById)
router.post('/', cinemaController.createCinema)
router.put('/:id', cinemaController.updateCinema)
router.post('/reserve', cinemaController.reserveSeats)
router.post('/purchase', cinemaController.purchaseSeats)
router.get('/:id/check-reservation', cinemaController.checkReservation)
router.post('/confirm-purchase', cinemaController.confirmPurchase)
// router.get('/:id/check-reservation', auth, cinemaController.checkReservation)
// router.post('/confirm-purchase', auth, cinemaController.confirmPurchase)
router.post('/check-seats',cinemaController.seatsCheck)
router.delete('/:id',cinemaController.deleteCinema)

module.exports = router

// module.exports = (app,io)=>{
//     const cinemaController = require('../controllers/cinemas-controller')(io)

//     app.get('/', cinemaController.getAllCinemas)
//     app.get('/:id', cinemaController.getCinemaById)
//     app.post('/', cinemaController.createCinema)
//     app.put('/:id', cinemaController.updateCinema)
//     app.post('/reserve', cinemaController.reserveSeats)
//     app.post('/purchase', cinemaController.purchaseSeats)
//     app.get('/:id/check-reservation', cinemaController.checkReservation)
//     app.post('/confirm-purchase', cinemaController.confirmPurchase)
//     app.post('/check-seats',cinemaController.seatsCheck)
// }