require('dotenv').config()
const User =require("../model/user");
const Order=require("../model/Order");
const Item=require("../model/Item");
const bcrypt=require("bcrypt");




module.exports={
    async GetUser(req,res){
        const {user_id}=req.headers;
        try{
              const user= await User.findById({_id:user_id});
             return res.status(200).json(user);
          }catch(error){
           return res.status(400).json({message:error});
      }
     },
     async Register(req,res){
        console.log(req)
        const {username,email,password,mobile,hno,society,pincode,detail}=req.body;
              try{
                     if(username.length===0||email.length===0){
                        return res.status(400).json({message:"you must fill properly!!"})
                     }
                        const hashedPassword=await bcrypt.hash(password,8);
                        const user= await User.create({username,email,password:hashedPassword,
                           mobile,Address:{
                           hno,society,pincode,detail
                           }});
                        user.GenerateAuthToken();
                       return res.status(200).json({user});
                    }catch(error){
                       console.log(error)
                       return res.status(400).json({message:error});
                 }
        },
        async Login(req,res){
            const {email,password}=req.body;
          try{ 
              const user=await User.findOne({email});
              console.log(user)
              if(!user){
               return res.status(404).json({message:"check your credentials"});
              }
              const passwordcompare=await bcrypt.compare(password,user.password);
             console.log(passwordcompare)
              if(user && passwordcompare){
                user.GenerateAuthToken();
                return res.status(200).json(user);
              }else {
                return res.status(400).json({ message: 'check your credentials' })
             }
          }catch(error){
             res.status(400).json({message:"check your credentials"})
          }
       
       },
    

  //first add auth middleware
  async CheckOrder(req,res,next){
   try{
      const user=req.user;
      ///for better authentication check with paymentToken
          if(user.has_plan!=null){
                req.planexist=true
                next()
          }else{
               req.planexist=false
                next()
          }
       }catch(error){
           return res.status(200).json({message:"not found"})
      }
  },
  async CreateOrder(req,res){
     const user=req.user;
     const {total,products}=req.body
     const {user_id}=req.body.headers;
     const dataitem=[]
     await products.map(async(data)=>{
       const item=await Item.findById(data)
       const itemobject=item.toObject()
       delete itemobject.type
       delete itemobject.images
       delete itemobject.description
       delete itemobject.quantity
       delete itemobject.care
       dataitem.push(itemobject)
      })
   try{
      ///for better authentication check with paymentToken
          if(user){
               const order=await Order.create({userid:user_id,total})
                const use=await User.findById(user._id).populate('orders').exec()
                Order.findById(order._id).exec(function (err, doc) {
                    doc["productsdata"]=dataitem
                    console.log(doc)
                    doc.save()
                  })
                  await order.save()
               return res.status(200).json({order,use});
          }else{
             return res.status(401).json({message:"user not exist"})
          }
       }catch(error){
           return res.status(404).json({message:error})
      }
},
async OrderConfirmation(req,res){
   const user=req.user;
   const {paymentStatus,description}=req.body;
   const {order_id}=req.body.headers;
   console.log(paymentStatus,description,order_id)
   try{
      if(user){
         const order=Order.findById(order_id).exec(function (err, doc) {
            doc["Paymentstatus"]=paymentStatus
            doc["description"]=description
            console.log(doc)
            doc.save()
          })
          if(paymentStatus==='success'){
             return res.status(200).json({message:"order confirmed"});
          }else{
            return res.status(200).json({message:"payment failed"});
          }
    }else{
       return res.status(401).json({message:"user not exist"})
    }
   }catch{
      return res.status(401).json({message:error})
   }
},
async GetUserOrder(req,res){
   try{
      const user=req.user;
      ///for better authentication check with paymentToken
          if(user){
                const UserOrders=await User.findById(user._id).populate('orders').exec()
               //  const populateOrderItems=await UserOrders.orders.map(data=>(
               //     data.products.map(async(data)=>{
               //        populate(data).exec()
               //       const item =await Item.findById(data)//  await Item.findById(data)
               //     })
               //  ))

               return res.status(200).json({UserOrders});
          }else{
             return res.status(401).json({message:"user not exist"})
          }
       }catch(error){
           return res.status(404).json({message:error})
      }
},
}
   // razorpay.payments.fetch(req.body.razorpay_payment_id).then(async (doc)=>{
   //    console.log(doc)
   //    if(doc.status='captured'){
 //BY CHECKING req.razorpay_order_id,req.razorpay_payment_id and req.razorpay_signature