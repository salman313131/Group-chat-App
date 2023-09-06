const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router.post('/add',userController.addNewUser)
router.post('/get',userController.getUser)

module.exports = router