const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define("Cart", {

 id:{
   type:DataTypes.INTEGER,
   autoIncrement:true,
   primaryKey:true
 },

 quantity:{
   type:DataTypes.INTEGER,
   defaultValue:1
 }

})

module.exports = Cart