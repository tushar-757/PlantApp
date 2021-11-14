require('dotenv').config()
const User =require("../model/user");
const Order=require("../model/Order");
const Indoor=require("../model/Indoor");
const Planter=require("../model/Planters");
const Seasonal=require("../model/Seasonal");
const CustomerQueries=require("../model/CustomerQueries");
const resetToken=require("../model/ResetToken");
const bcrypt=require('bcryptjs');
const Razorpay=require('razorpay')
const crypto = require("crypto");
const Outdoor = require('../model/Outdoor');
const ReportBug = require('../model/BugReporting');
const EmailController= require('./EmailController');
const { resolve } = require('path');
const CustomerReviews = require('../model/CustomerReviews');
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
        const {username,email,password,mobile,hno,society,pincode,detail}=req.body;
              try{
                     if(username?.length===0||email?.length===0){
                        return res.status(400).json({message:"you must fill properly!!"})
                     }
                     const user1=await User.findOne({email});
                      if(user1){
                         return res.status(200).json({message:"user already exist"});
                        }
                        const hashedPassword=await bcrypt.hash(password,8);
                        // EmailController.sendwelcomeemail2(email,username)
                        const user=await User.create({username,email,password:hashedPassword,
                           mobile,Address:{
                              hno,society,pincode,detail
                           }})
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
              if(!user){
               return res.status(403).json({message:"check your credentials"});
              }
              const passwordcompare=await bcrypt.compare(password,user.password);
             console.log(passwordcompare)
              if(user && passwordcompare){
                user.GenerateAuthToken();
               //  EmailController.sendWelcomeEmail(user.email,user.username)
                return res.status(200).json(user);
              }else {
                return res.status(403).json({ message: 'check your credentials' })
             }
          }catch(error){
             console.log(error)
             res.status(403).json({message:"check your credentials"})
          }

       },
  async CreateOrder(req,res){
     const user=req.user;
     const {total,products,customization,shippingAddress,lat,lng}=req.body
     const {user_id}=req.body.headers;
     const dataitem=[]

     const setSource =async()=>{
        try{
           await Promise.all(products.map(async(data)=>{
                 let item=await Indoor.findById(data.id)
                 if(item===null){
                   item=await Outdoor.findById(data.id)
                   if(item===null){
                      item=await Seasonal.findById(data.id)
                      if(item===null){
                         item=await Planter.findById(data.id)
                         console.log(item?.quantity)
                      }
                   }
                 }
                 item.quantity=item.quantity-data.quantity
                 await item.save()
                 console.log(item)
                 const itemobject=item.toObject()
                 itemobject.addons=data.addons
                 delete itemobject.type
                 delete itemobject.images
                 delete itemobject.customImages
                 delete itemobject.description
                 delete itemobject.quantity
                 delete itemobject.care
                 itemobject.quantity=data.quantity
                 dataitem.push(itemobject)
                }))
              }catch(e){
                 console.log(e)
              }
        }

    try{
      ///for better authentication check with paymentToken
          if(user){
             const orders=await Order.find({})
             var options = {
               amount: total,  // amount in the smallest currency unit
               currency: "INR",
              receipt: `order_rcptid_${orders.length}`
              };
             const razorpayorder=await razorpay.orders.create(options)
             setSource().then(async()=>{
                console.log("inside async call"+dataitem)
                  const order=await Order.create({
                      Paymentstatus:"pending",
                      OrderId:razorpayorder?.id,
                      userid:user_id,
                      total:(total/100),
                      currency:razorpayorder?.currency,
                      receipt:razorpayorder?.receipt,
                      status:razorpayorder?.status,
                      attempts:razorpayorder?.attempts,
                      amountPaid:razorpayorder?.amount_paid,
                      shippingAddress:shippingAddress,
                      customization:customization,
                      location:{lat:lat,lng:lng}
                  })
                   Order.findById(order._id).exec(function (err, doc) {
                       doc["productsdata"]=dataitem
                       console.log(doc)
                       doc.save()
                     })
                     await order.save()
                  return res.status(200).json(order);
               }
               )
          }else{
             return res.status(401).json({message:"user not exist"})
          }
       }catch(error){
           return res.status(404).json({message:error})
      }
},
async DeleteOrder(req,res){
   const user=req.user;
   let {order_id}=req.body?.headers
   if(order_id===undefined){
      order_id=req?.headers?.order_id
   }
   console.log(order_id)
   const RestoreInventory=async()=>{
      try{
         const products=await Order.findById(order_id)
         await Promise.all(products?.productsdata?.map(async(data)=>{
         let item=await Indoor.findById(data._id)
         if(item===null){
         item=await Outdoor.findById(data._id)
         if(item===null){
            item=await Seasonal.findById(data._id)
            if(item===null){
               console.log(data._id)
               item=await Planter.findById({_id:data._id})
            }
         }
       }
       item.quantity=item.quantity+data.quantity
       await item.save()
    }))
   }catch(e){
       console.log("failed to do so"+e)
    }
   }
   try{
      if(user){
         RestoreInventory().then(async()=>{
            const order=await Order.findByIdAndDelete(order_id)
         }).then(()=>{
            return res.json({message:"deleted succesfully"});
         })
      }else{
         return res.status(401).json({message:"user not exist"})
      }
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

    const FiveDigitNumberArray=[]
    let FiveDigitOtp="";
    const GenerateFiveDigitNumber=()=>{
       for(let i=0;i<5;i++){
          FiveDigitNumberArray[i]=generateRandom()
       }
        FiveDigitOtp = FiveDigitNumberArray.toString().replace(/,/g,'')
    }
    const generateRandom=()=>{
     return Math.floor((Math.random() * 9) + 1)
    }
    GenerateFiveDigitNumber()
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
         order.code=FiveDigitOtp
         order.scheduled=false
         // EmailController.sendOrderInvoiceEmail(user?.email,user?.username,order)
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
async UpdateUser(req,res){
     try{
      const user=req.user;
      const {username1,email1,mobile1}=req?.body;
      if(user){
         const userrecieve=await User.findById(user._id)
           userrecieve.username=username1
           userrecieve.email=email1
           userrecieve.mobile=mobile1
           await userrecieve.save()
        return res.status(200).json(userrecieve);
        }else{
         return res.status(401).json({message:"user not exist"})
       }
     }catch(e){
      return res.status(404).json({message:e})
     }
},
async UpdateAddressUser(req,res){
     try{
      const user=req.user;
      const {hno,society,pincode}=req?.body;
      if(user){
         const userrecieve=await User.findById(user._id)
           userrecieve.Address.hno=hno
           userrecieve.Address.society=society
           userrecieve.Address.pincode=pincode
           await userrecieve.save()
        return res.status(200).json(userrecieve);
        }else{
         return res.status(401).json({message:"user not exist"})
       }
     }catch(e){
      return res.status(404).json({message:error})
     }
},
async DeleteAccount(req,res){
   try{
      const user=req.user;
      if(user){
         const userrecieve=await User.findById(user._id)
         const UserOrders=await User.findById(user._id).populate('orders').exec()
           await userrecieve.delete()
           await UserOrders.delete()
        return res.status(200).json({message:"deleted successfully"});
        }else{
         return res.status(401).json({message:"user not exist"})
       }
     }catch(e){
      return res.status(404).json({message:error})
     }
},
async sendResetPasswordEmail(req,res){
   try{
      const {email}=req.body;
      const user=await User.findOne({email})
      if(user){
         let resettoken = await resetToken.findOne({ userId: user._id });
         if (!resettoken) {
             resettoken = await new resetToken({
                 userId: user._id,
                 token: crypto.randomBytes(32).toString("hex"),
             }).save();
         }
         const link = `http://localhost:3000/password-reset/${user._id}/${resettoken.token}`;
          EmailController.passwordresetEmail(user.email, "Password reset", link);
         return res.send("password reset link sent to your email account");
         // const hashedPassword=await bcrypt.hash(password,8);
         // user.password=hashedPassword
         // await user.save()
         // return res.status(200).json({message:"updated Successfully"});
        }else{
         return res.status(401).json({message:"User Not Exist"})
       }
   }catch(e){
      console.log(e)
      return res.status(404).json({message:e})
   }
},async ResetPassword(req,res){
   const {password}=req.body;
   try{
      const user = await User.findById(req.params.userId);
       if(user){
         const token = await resetToken.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
           return res.status(400).send({message:"Invalid link or expired"})
         }
         const hashedPassword=await bcrypt.hash(password,8);
         user.password=hashedPassword
         await user.save();
         await token.delete();
        return  res.status(200).send({message:"password reset sucessfully."});
       }
       return res.status(400).send({message:"invalid link or expired"});
    }catch(e){
      console.log(e)
      return res.status(404).json({message:e})
    }
},
async ChangeOrderDelieveryDate(req,res){
   const user=req.user;
   let {order_id}=req.body?.headers
   if(order_id===undefined){
      order_id=req?.headers?.order_id
   }
   const {date}=req.body;
   try{
       if(user){
         const UserOrders=await Order.findById(order_id);
         if(UserOrders?.Paymentstatus!='pending' && UserOrders.Active===true){
            UserOrders.userRequestedDate=date;
            await UserOrders.save()
           return res.status(200).json({message:"updated Successfully"});
         }
         return res.status(200).json({message:"Your order is either Delievered or may be pending for payment"});
      }
         return res.status(401).json({message:"user not exist"})
   }catch(e){
      return res.status(404).json({message:e})
   }
},async sendCustomerReviews(req,res){
   const user=req.user
   const {description,rating,item}=req.body;
   try{
      if(user){
         const data=await CustomerReviews.create({
           userid:user._id,
           username:user?.username,
           description:description,
           stars:rating,
           ...item
         })
         return res.status(200).json(data);
      }
      return res.status(401).json({message:"user not exist register first"})
   }catch(e){
      console.log(e)
      return res.status(404).json({message:e})
   }
},async CustomerQueries(req,res){
   const user=req.user
   const {email,description,mobile}=req.body;
   try{
      if(user){
         const data=await CustomerQueries.create({
           email:email,
           description:description,
           mobile:mobile
         })
         return res.status(200).json({message:"Sent Successfully"});
      }
      return res.status(401).json({message:"user not exist register first"})
   }catch(e){
      return res.status(404).json({message:e})
   }
},async ReportaBug(req,res){
   const user=req.user
   const {email,description,mobile}=req.body;
   try{
      if(user){
         const data=await ReportBug.create({
           email:email,
           description:description,
           mobile:mobile
         })
         return res.status(200).json({message:"Sent Successfully"});
      }
      return res.status(401).json({message:"user not exist register first"})
   }catch(e){
      return res.status(404).json({message:e})
   }
}
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


