require("dotenv").config()
const app = require("./src/app")
const { sequelize } = require("./src/models")

const PORT = process.env.PORT || 5000

sequelize.sync({ alter:true }).then(()=>{

 console.log("Database synced")

 app.listen(PORT,()=>{
   console.log(`Server running on ${PORT}`)
 })

}).catch((err)=>{
    console.error("Error syncing database:", err)
})