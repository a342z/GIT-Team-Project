//  _id which is ObjectID
//  Email which is unique
//  Password
//  fullName
//  Role: which is enum [“Student”,”Instructor”]
//  Image
//  Address (city,street,building)
const mongoose = require("mongoose");
const increment = require ("mongoose-sequence")(mongoose)
const schema =new mongoose.Schema({
    // _id:mongoose.SchemaTypes.ObjectId,
    _id:Number,
    email:{
        type:String,
        unique:true,
        required: true
    },
    password:String,
    fullname:String,
    Role:{
        type:String,
        enum:["student","instructor"]
    },
    image:String,
    address:{
        city:String,
        street:String,
        building:Number
    }
},{_id:false})


schema.plugin(increment,{id:"speakerIncrement",inc_field:"_id"})
module.exports=mongoose.model("speaker",schema)