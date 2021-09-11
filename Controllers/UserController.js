require('dotenv').config()
const User =require("../model/user");
const Order=require("../model/Order");
const Item=require("../model/Item");
const bcrypt=require("bcrypt");
const Razorpay=require('razorpay')
const crypto = require("crypto")

const razorpay = new Razorpay({ key_id:process.env.RAZOR_PAY_KEY_ID, key_secret:process.env.RAZOR_PAY_KEY_SECRET });

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
      var options = {
         amount: total,  // amount in the smallest currency unit
         currency: "INR",
         receipt: "order_rcptid_11"
       };
    try{
      ///for better authentication check with paymentToken
          if(user){
             const razorpayorder=await razorpay.orders.create(options)
               const order=await Order.create({
                   Paymentstatus:"pending",
                   OrderId:razorpayorder?.id,
                   userid:user_id,
                   total:(total/100),
                   currency:razorpayorder?.currency,
                   receipt:razorpayorder?.receipt,
                   status:razorpayorder?.status,
                   attempts:razorpayorder?.attempts,
                   amountPaid:razorpayorder?.amount_paid
               })
                const use=await User.findById(user._id).populate('orders').exec()
                Order.findById(order._id).exec(function (err, doc) {
                    doc["productsdata"]=dataitem
                    console.log(doc)
                    doc.save()
                  })
                  await order.save()
               return res.status(200).json(order);
          }else{
             return res.status(401).json({message:"user not exist"})
          }
       }catch(error){
           return res.status(404).json({message:error})
      }
},
async DeleteOrder(req,res){
   const user=req.user;
   let order_id=req.body?.headers?.order_id
   if(order_id===undefined){
      order_id=req?.headers?.order_id
   }
   console.log(order_id)
   try{
      if(user){
         console.log(order_id)
         const order=await Order.findByIdAndDelete(order_id)
         return res.json({message:"deleted succesfully"});
      }
      return res.status(401).json({message:"user not exist"})
   }catch(e){
      return res.status(401).json({message:e})
         }
},
async OrderConfirmation(req,res){
   const user=req.user;
   const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
   let {order_id}=req.body?.headers
   if(order_id===undefined){
      order_id=req?.headers?.order_id
   }
   console.log(order_id)
   try{
      if(user){
         checkcode = razorpay_order_id + "|" + razorpay_payment_id;     
         // //generate signature key
         var expectedSignature =crypto
         .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
         .update(checkcode.toString())
         .digest("hex");
         if (expectedSignature === razorpay_signature){
         const order=await Order.findById(order_id)
         order.Paymentstatus='success'
         order.amountPaid="paid"
         order.description=`order ${order._id} with UserId${user._id} is placed successfully`
         order.razorPaymentId=razorpay_payment_id
         await order.save();
         return res.json(order);
         }
         return res.status(400).json({message:`payment of user ${user._id} for order ${order_id} failed` })
      }
       return res.status(401).json({message:"user not exist"})
   }catch(error){
      return res.status(401).json({message:error})
   }
},
async GetUserOrder(req,res){
   try{
      const user=req.user;
      ///for better authentication check with paymentToken
          if(user){
                const UserOrders=await User.findById(user._id).populate('orders').exec()
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
//  .exec(function (err, doc) {
//    if (err) {
//        return done(err);
//    }
//    doc["Paymentstatus"]=paymentStatus
//    doc["description"]=description
//    console.log(doc)
//    doc.save()
//  })
// , (err, order)=> {
//    if(err){
//      return  res.status(400).json({message:"something went wrong"});
//    }
//     res.json(order);
// })


