const Order = require('../model/Order');
const bcrypt=require('bcryptjs');
const Employee=require("../model/Employee")
require('dotenv').config()

module.exports={
    async TakeOrder(req,res){
        const Employee=req.employee;
        let order_id=req?.headers?.order_id
        if(order_id===null||order_id===undefined){
            order_id=req?.body?.headers?.order_id
        }
        try{
              const order=await Order.findById(order_id);
              if(order.employeeid===null||order.employeeid===undefined){
                  order.employeeid=Employee._id
                  order.status='Dispatched'
                  await order.save()
                 return res.status(200).json({message:"order is taken successfully"});
              }
              return res.status(200).json({message:"order is already taken"})
          }catch(error){
           return res.status(400).json({message:error});
      }
    },
    async GetEmployeeActiveOrder(req,res){
        try{
            const employee=req.employee;
            ///for better authentication check with paymentToken
                if(employee){
                      const EmployeeOrders=await Employee.findById(employee._id).populate('orders').exec()
                     return res.status(200).json(EmployeeOrders);
                }else{
                   return res.status(401).json({message:"Employee not exist"})
                }
             }catch(error){
                 return res.status(404).json({message:error})
            }
    },
    async SetOrderDelivered(req,res){
        let order_id=req?.headers?.order_id
        if(order_id===null||order_id===undefined){
            order_id=req?.body?.headers?.order_id
        }
        const verificationCode=req?.body?.verificationCode;
        try{
            const employee=req.employee;
            ///for better authentication check with paymentToken
                if(employee){
                    const order=await Order.findById(order_id);
                    if(order.code===verificationCode){
                        order.Active=false
                        order.status='Delievered'
                        await order.save();
                        return res.status(200).json(order);
                    }
                     return res.status(200).json({message:"code doesn't match"});
                }else{
                   return res.status(401).json({message:"Employee not exist"})
                }
             }catch(error){
                 return res.status(404).json({message:error})
            }
    },
    async Register(req,res){
        console.log(req)
        const {username,email,password,mobile,age,gender,hno,society,pincode,detail}=req.body;
              try{
                     if(username.length===0||email.length===0){
                        return res.status(400).json({message:"you must fill properly!!"})
                     }
                        const hashedPassword=await bcrypt.hash(password,8);
                        const employee= await Employee.create({username,email,password:hashedPassword,
                           mobile,age,gender,Address:{
                           hno,society,pincode,detail
                           }});
                       return res.status(200).json({employee});
                    }catch(error){
                        console.log(error)
                       return res.status(400).json({message:error});
                 }
        },
        async Login(req,res){
            const {email,password}=req.body;
          try{
              const employee=await Employee.findOne({email});
              if(!employee){
               return res.status(404).json({message:"check your credentials"});
              }
              const passwordcompare=await bcrypt.compare(password,employee.password);
              if(employee && passwordcompare){
                return res.status(200).json(employee);
              }else {
                return res.status(400).json({ message: 'check your credentials' })
             }
          }catch(error){
             res.status(400).json({message:"check your credentials"})
          }
       },

}