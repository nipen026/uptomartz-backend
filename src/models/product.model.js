const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {

  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },

  name:{
    type:DataTypes.STRING,
    allowNull:false
  },

  description:{
    type:DataTypes.TEXT
  },

  price:{
    type:DataTypes.FLOAT,
    allowNull:false
  },

  stock:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },

  image:{
    type:DataTypes.STRING
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

})

module.exports = Product