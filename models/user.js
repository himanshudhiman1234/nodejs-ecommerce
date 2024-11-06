const mongoose = require("mongoose")


const user = new mongoose.Schema({
name:{type:String,required:true},
email:{type:String,required:true},
role:{type:String,enum:["user","admin"],default:"user",required:true},
password : {type:String,required:true},
confirmPassword:{type:String,required:true}
})



const User =   mongoose.model("user",user)

module.exports  = User;