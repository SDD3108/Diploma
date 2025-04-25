const express = require('express')
const router = express.Router()

const cinemaController = require('../controllers/cinemas-controller')

router.get('/', cinemaController.getAllCinemas)
router.get('/:id', cinemaController.getCinemaById)
router.post('/', cinemaController.createCinema)
router.put('/:id', cinemaController.updateCinema)

module.exports = router