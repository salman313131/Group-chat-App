const Sequelize = require('sequelize')
const sequelize = require('../util/db')

const Group = sequelize.define('group',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true,
    },
    name:{
        type: Sequelize.STRING,
    },
    createdby:{
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports = Group