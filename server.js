const express = require("express")
const Sequelize = require("sequelize")


const app = express()
const port = 8001

const connection = new Sequelize("db" , "user" , "pass" ,{
    host:'localhost',
    dialect:"sqlite",
    storage:'db.sqlite',
    // operatorsAliases:false
})

const User = connection.define("User" , {
    uuid:{
        type:Sequelize.UUID,
        primaryKey:true,
        defaultValue:Sequelize.UUIDV4
    },
    name :Sequelize.STRING,
    bio:Sequelize.TEXT
});

connection
.sync({
    logging:console.log,
    force:true
}).then(()=>{
    User.create({
        name:"Hamza Khan",
        bio:"This is my bio"
    })
})
.then(()=>console.log('database connected'))
.catch((e)=>console.log("some error database " ,e))

app.listen(port,()=>{
    console.log("Server is running on port " , port)
})