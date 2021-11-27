const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
// const {Product} = require("./Product");
// const {Order} = require("./Order");
const ProductGroup = sequelize.define('product_groups', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    quantity: {type:Sequelize.INTEGER, allowNull: false},

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});





module.exports = ProductGroup