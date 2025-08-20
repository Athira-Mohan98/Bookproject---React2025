//import mongoose
const mongoose = require('mongoose')

//Create schema and model
const applicantSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    JobTitle:{
         type:String,
        required:true
    },
    qualification:{
         type:string,
        required:true
    },
    email:{
         type:String,
        required:true
    },
    Phone:{
         type:string,
            required:true
    },
    coverletter:{
         type:Number,
        required:true
    },
     resume:{
         type:Number,
        required:true
    }


})

module.exports = mongoose.model("applicants",bookSchema)