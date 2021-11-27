const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
// const {Order} = require("./Order");
const Customer = sequelize.define('customers', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    name: { type: Sequelize.STRING, allowNull:false },
    email: { type: Sequelize.STRING, allowNull:false, unique: true},
    street: { type: Sequelize.STRING, allowNull: false},
    number: { type: Sequelize.STRING, allowNull: false},
    postal_code: { type: Sequelize.STRING, allowNull: false},
    city: { type: Sequelize.STRING, allowNull: false},

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})


module.exports = Customer