//admin auth
// const jwt=require("jsonwebtoken");
// const Employee = require("../model/Employee");


// const auth=async (req,res,next)=>{
//     try{
//         // console.log(req.headers)
//         // console.log(req.body.headers)
//         //for postman = req.header("Authorization").replace("Bearer ",'')
//         //for server = req.body.headers.Authorization.replace("Bearer ",'');
//        let token= req.body.headers?.Authorization.replace("Bearer ",'');
//        if(token===undefined){
//          token=req.headers.authorization.replace("Bearer ",'');
//        }
//       //  console.log(token+"token")
//        const decode=jwt.verify(token,process.env.Secret_Key);

//        const employee=await Employee.findOne({_id:decode._id,'tokens.token': token});
//       //  console.log(employee)
//        if(!employee){
//          return  res.status(404).json({message:"signp/login first"})
//        }
//        req.token=token;
//        req.employee=employee;

//        next()
//     }catch(e){
//         // console.log(e)
//         res.status(400).json({message:"invalid token/you must be an authorize user to access it"})
//     }
// }

// module.exports=auth;