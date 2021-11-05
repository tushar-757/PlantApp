const mongoose =require("mongoose");
const validator=require("validator");

const UserQuerySchema=new mongoose.Schema({

}, { timestamps: true , toJSON: { virtuals: true } })


module.exports= mongoose.model("UserQuery",UserQuerySchema);