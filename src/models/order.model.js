const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {

 id:{
   type:DataTypes.INTEGER,
   primaryKey:true,
   autoIncrement:true
 },

 total:{
   type:DataTypes.FLOAT,
   allowNull:false
 },

 status:{
   type:DataTypes.STRING,
   defaultValue:"pending"
 },

 paymentMethod:{
   type:DataTypes.STRING
 },

 stripePaymentIntentId:{
   type:DataTypes.STRING
 },

 stripePaymentId:{
   type:DataTypes.STRING
 },

 paymentStatus:{
   type:DataTypes.STRING,
   defaultValue:"pending"
 }

})

module.exports = Order