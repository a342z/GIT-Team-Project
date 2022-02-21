//  _id which is number
//  title
//  date
//  main speaker refers to speaker
//  speakers refer to array of speakers
//  students refer to array of students

const mongoose = require("mongoose");
const increment = require ("mongoose-sequence")(mongoose)
const schema = new mongoose.Schema({
_id:Number,
title:String,
date:String,
mainspeaker:{
    ref:"speakers",
    type:String
},
speakers:[
    {
        type:Number,ref:"speakers"
    }
],
students:[
    {
        type:Number, refer:"students"
    }
]


},{_id:false})
schema.plugin(increment,{id:"eventIncrement",inc_field:"_id"})
module.exports=mongoose.model("event",schema)
