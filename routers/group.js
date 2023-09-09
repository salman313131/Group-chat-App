const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const groupController = require('../controllers/group')

router.post('/create',auth,groupController.createGroup)
router.get('/getgroup',auth,groupController.getGroup)
router.get('/getchat/',auth,groupController.getChat)
router.post('/adduser',groupController.addUser)
router.get('/userdis/:groupId',auth,groupController.getAllUser)
router.delete('/delete/:id',groupController.deleteGroupMember)

module.exports = router