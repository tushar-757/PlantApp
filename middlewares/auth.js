const jwt=require("jsonwebtoken");
const User = require("../model/user");


const auth=async (req,res,next)=>{
    try{
        console.log(req.body)
        //for postman = req.header("Authorization").replace("Bearer ",'')
        //for server = req.body.headers.Authorization.replace("Bearer ",'');
       const token= req.header("Authorization").replace("Bearer ",'')
       console.log(token+"token")
       const decode=jwt.verify(token,process.env.Secret_Key);
    
       const user=await User.findOne({_id:decode._id,'tokens.token': token});
       console.log(user)
       if(!user){
           res.status(404).json({message:"signp/login first"})
       }
       req.token=token;
       req.user=user;

       next()
    }catch(e){
        res.status(400).json({message:"invalid token/you must be an authorize user to access it"})
    }
}

module.exports=auth;