const mongoose =require("mongoose");
const validator=require("validator");

const ItemSchema=new mongoose.Schema({
    SKU:{
        type:String,
    required:true},
    name:{
        type:String,
         required:true
    },
    likes:{
        type:Number,
        default:0
    },
    type:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:[{
        type:String,
    }],
    customImages:[{
          type:String,
        }],
    care:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    date:String
})

module.exports= mongoose.model("Item",ItemSchema);