const mongoose =require("mongoose");
const jwt=require("jsonwebtoken");
const validator=require("validator");
const EmployeeSchema=new mongoose.Schema({
    username:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
         type:String,
         required:true
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
    }
},{  toJSON: { virtuals: true } })

// EmployeeSchema.methods.GenerateAuthToken = async function(){
//     const user=this;
//     const token = jwt.sign({_id:user._id},process.env.Secret_Key,{ expiresIn: '45 days'});
//     user.tokens=user.tokens.concat({token})
//     user.token=token
//     await user.save()
// }

EmployeeSchema.virtual('orders',{
    ref:"Order",
    localField:'_id',
    foreignField:'employeeid'
})

module.exports=mongoose.model("Employee",EmployeeSchema);