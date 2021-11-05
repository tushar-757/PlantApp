const mongoose =require("mongoose");
const jwt=require("jsonwebtoken");
const validator=require("validator");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true
    },email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is not valid');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    mobile:{
        type:String,
        required:true,
        minlength:10
    },
    Address:{
        hno:{
            type:String,
            required:true,
        },
        society:{
            type:String,
            required:true,
        },
        pincode:{
            type:String,
            required:true,
        },
        detail:{
            type:String
        }
    },
    tokens:[{
        token:{
            type:String
        }
    }],
    token:{
        type:String
    }
},{  toJSON: { virtuals: true } })


userSchema.methods.GenerateAuthToken = async function(){
    const user=this;
    const token = jwt.sign({_id:user._id},process.env.Secret_Key,{ expiresIn: '45 days'});
    user.tokens=user.tokens.concat({token})
    user.token=token
    await user.save()
}

userSchema.virtual('orders',{
    ref:"Order",
    localField:'_id',
    foreignField:'userid'
})
userSchema.virtual('CustomerReviews',{
    ref:"CustomerReview",
    localField:'_id',
    foreignField:'userid'
})
module.exports=mongoose.model("User",userSchema);


// userSchema.methods.GeneratePaymentToken = async function(){
//     const user=this;
//     const token = jwt.sign({_id:user._id},process.env.Secret_Paid_Key,{expiresIn:"30 Days"});
//     user.Paymenttokens=user.Paymenttokens.concat({paymentToken:token})
//     user.paymentToken=token
// }



// userSchema.pre('save',async function(next){
//        const user=this;
//        const token = jwt.sign({id:user._id},process.env.Secret_Paid_Key,{expiresIn:"30 Days"});
//        user.tokens=user.tokens.concat({token})
//        user.token=token
//        console.log("printing before saving");
//        next();
// })