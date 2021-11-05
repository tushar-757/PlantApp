const mongoose =require("mongoose");
const validator=require("validator");

const SoilFertilizerSchema=new mongoose.Schema({
    SKU:{
        type:String,
    required:true},
    likes:{
        type:Number,
        default:0
    },
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
    BestSelling:{
        type:Boolean,
        default:false
    },
    date:String
})

module.exports= mongoose.model("SoilFerti",SoilFertilizerSchema);