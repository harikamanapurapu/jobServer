
const mongoose=require("mongoose")

const Userschema=new mongoose.Schema({
    nameinput:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
})

const User=mongoose.model("User",Userschema)
module.exports= User