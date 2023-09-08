const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const groupController = require('../controllers/group')

router.post('/create',auth,groupController.createGroup)
router.get('/getgroup',auth,groupController.getGroup)
router.get('/getchat/',auth,groupController.getChat)

module.exports = router