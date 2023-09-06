require('dotenv').config()
const express = require('express')
const sequelize = require('./util/db')
const app = express()

//router

app.use(express.static('./public'))


sequelize.sync().then(()=>{
    
    app.listen(8000)
}).catch(err=>console.log(err))