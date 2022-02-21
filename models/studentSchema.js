//  _id which is Number
//  Fullname 
//  Email
//  password


const mongoose = require("mongoose");
const increment = require ("mongoose-sequence")(mongoose)
const schema =new mongoose.Schema({

_id:Number,
fullname:String,
password:String,
email:String //????

},{_id:false});


schema.plugin(increment,{id:"studentIncrement",inc_field:"_id"})
module.exports=mongoose.model("student",schema)
