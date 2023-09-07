const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Groupchat = sequelize.define('groupchat',{
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
    }
})
module.exports = Groupchat