require('dotenv').config()
const express = require('express')
const sequelize = require('./util/db')
const cors = require('cors')
const app = express()

//router
const userRouter = require('./routers/users')
const chatRouter = require('./routers/chat')
const groupRouter = require('./routers/group')

const bodyParser = require('body-parser')

//modal
const User = require('./modal/user')
const Chat = require('./modal/chat')
const Group = require('./modal/group')
const Usergroup = require('./modal/usergroup')

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use(cors())

app.use('/api/v1',userRouter)
app.use('/api/v1/chat',chatRouter)
app.use('/api/v1/group',groupRouter)

//relationships
Chat.belongsTo(User)
User.hasMany(Chat)
User.belongsToMany(Group, {through:Usergroup})
Group.belongsToMany(User, {through:Usergroup})
Chat.belongsTo(Group)
Group.hasMany(Chat)


sequelize.sync().then(()=>{
    
    app.listen(4000)
}).catch(err=>console.log(err))