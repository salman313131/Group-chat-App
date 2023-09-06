const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')

router.post('/add',userController.addNewUser)

module.exports = router