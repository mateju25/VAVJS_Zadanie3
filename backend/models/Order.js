const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
// const {Customer} = require("./Customer");
// const {ProductGroup} = require("./ProductGroup");
const Order = sequelize.define('orders', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    state: { type: Sequelize.STRING, allowNull:false },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})


module.exports = Order