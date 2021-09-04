const mongoose =require("mongoose");
const validator=require("validator");

const ItemSchema=new mongoose.Schema({
    name:{
        type:String,
         required:true       
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
        required:true
    }],
    care:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
})

module.exports= mongoose.model("Item",ItemSchema);