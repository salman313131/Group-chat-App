require('dotenv').config()
const express = require('express')
const sequelize = require('./util/db')
const cors = require('cors')
const app = express()

//router
const userRouter = require('./routers/users')
const bodyParser = require('body-parser')

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use(cors())

app.use('/api/v1',userRouter)

sequelize.sync().then(()=>{
    
    app.listen(8000)
}).catch(err=>console.log(err))