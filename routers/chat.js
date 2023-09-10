const chatController = require('../controllers/chat')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()

const multer = require('multer');


const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.get('/get',auth,chatController.getChat)
router.post('/message',auth,chatController.postChat)
router.get('/dis/:localId',auth,chatController.getAll)
router.post('/file',auth,upload.single('file'),chatController.postFiledata)

module.exports = router