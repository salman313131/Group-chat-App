const chatController = require('../controllers/chat')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.get('/get',auth,chatController.getChat)
router.post('/message',auth,chatController.postChat)
router.get('/getall',auth,chatController.getAll)

module.exports = router