const mongoose =require("mongoose");
const validator=require("validator");

const OrderSchema=new mongoose.Schema({
    Paymentstatus:{
        type:String
    },
    description:{
        type:String
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    total:{
        type:Number
    },
    productsdata:[]
}, { timestamps: true , toJSON: { virtuals: true } })

OrderSchema.virtual('Items',{
    ref:"Item",
    localField:'_id',
    foreignField:'OrderId'
})
module.exports= mongoose.model("Order",OrderSchema);