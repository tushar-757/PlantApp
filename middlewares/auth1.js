const Employee = require("../model/Employee");


const auth1=async (req,res,next)=>{
    try{
      let employee_id=req?.headers?.employee_id;
      if(employee_id===null||employee_id===undefined){
            employee_id=req?.body?.headers?.employee_id
      }
       const employee=await Employee.findById(employee_id);
       if(!employee){
         return  res.status(404).json({message:"signp/login first"})
       }
       req.employee=employee;

       next()
    }catch(e){
        // console.log(e)
        res.status(400).json({message:`something went wrong ${e}`})
    }
}

module.exports=auth1;