const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
const Ad = sequelize.define('ads', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    link: { type: Sequelize.STRING, allowNull:false },
    img_src: { type: Sequelize.STRING, allowNull:false, unique: true},
    counter: { type: Sequelize.INTEGER, allowNull: false},

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})

module.exports = Ad