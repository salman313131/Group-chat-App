const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Chat = sequelize.define('chat',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
    },
    chat:{
        type: Sequelize.TEXT,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    filetype:{
        type:Sequelize.STRING,
        defaultValue: 'chat'
    }
})
module.exports = Chat