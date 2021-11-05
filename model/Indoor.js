const mongoose =require("mongoose");
const validator=require("validator");

const IndoorSchema=new mongoose.Schema({
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
},{  toJSON: { virtuals: true } })
IndoorSchema.virtual('reviews',{
    ref:"CustomerReview",
    localField:'_id',
    foreignField:'indoorid'
})
IndoorSchema.virtual('Customizations',{
    ref:"Planter",
    localField:'_id',
    foreignField:'indoorcustomid'
})


module.exports= mongoose.model("Indoor",IndoorSchema);