const mongoose =require("mongoose");
const validator=require("validator");

const OutdoorSchema=new mongoose.Schema({
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
    potIncluded:{
        price:{
            type:Number
        },
        isPotIncluded:{
            type:Boolean
        }
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
},{  toJSON: { virtuals: true } })


OutdoorSchema.virtual('reviews',{
    ref:"CustomerReview",
    localField:'_id',
    foreignField:'outdoorid'
})
OutdoorSchema.virtual('Customizations',{
    ref:"Planter",
    localField:'_id',
    foreignField:'outdoorcustomid'
})


module.exports= mongoose.model("Outdoor",OutdoorSchema);