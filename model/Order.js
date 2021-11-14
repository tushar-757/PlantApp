const mongoose =require("mongoose");
const validator=require("validator");

const OrderSchema=new mongoose.Schema({
    Paymentstatus:{
        type:String
    },
    OrderId:{
        type:String,
        required:true
    },
    razorPaymentId:{
        type:String
    },
    currency:{
        type:String
    },
    receipt:{
        type:String
    },
    status:{
        type:String
    },
    scheduled:{
       type:Boolean
    },
    attempts:{
        type:String
    },
    shippingAddress:Object,
    location:Object,
    code:{
      type:String
    },
    amountPaid:{
        type:String
    },
    description:{
        type:String
    },
    customization:[
        {
            type:String
        }
    ],
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    employeeid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },
    Active:{
        type:Boolean,
        default:true
    },
    userRequestedDate:{
        type:String,
        default:null
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