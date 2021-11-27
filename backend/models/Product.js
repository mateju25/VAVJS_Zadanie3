const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
// const {ProductGroup} = require("./ProductGroup");

const Product = sequelize.define('products', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },

    name: { type: Sequelize.STRING, allowNull:false },
    img_src: { type: Sequelize.STRING, allowNull:false },
    cost: { type: Sequelize.FLOAT, allowNull: false},

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})

// Product.ProductGroup = Product.hasOne(ProductGroup);
module.exports = Product