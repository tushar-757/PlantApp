const express=require("express");
const router = express.Router();
const auth=require("../middlewares/auth")
const UserController=require("../Controllers/UserController");
const rateLimit = require("express-rate-limit");
//get users
require('dotenv').config()
router.get("/",(req,res)=>{
    res.render("index")
})
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });
const createLoginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 5 requests
    message:
      "Too many Login requests created from this IP, please try again after 5 minutes"
  });
const createresetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // start blocking after 5 requests
    message:
      "Too many Reset requests created from this IP, please try again after an hour"
  });
const createorderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // start blocking after 10 requests
    message:
      "Too many Create Order requests created from this Account  IP, please try again after an hour"
  });
//create order id for razorpay
router.post("/createOrder",createorderLimiter,auth,UserController.CreateOrder);
router.get("/GetOrders",auth,UserController.GetUserOrder);
router.put("/OrderConfirmation",auth,UserController.OrderConfirmation);
router.put("/DeleteOrder",auth,UserController.DeleteOrder);

//call back handler for razorpay
//save all info in plan creted with user with user_id
// router.post("/is-order-completed",UserController.AcceptCredentialsRazorPay);

//get loggedin user info
router.get("/user",auth,UserController.GetUser);
router.post("/userreview",auth,UserController.sendCustomerReviews);
//sign-up
router.post("/user/Register",createAccountLimiter,UserController.Register);
router.delete("/user/DeleteAccount",auth,UserController.DeleteAccount);
router.put("/user/ResetPassword",createresetPasswordLimiter,UserController.sendResetPasswordEmail);
router.put("/user/:userId/:token",createresetPasswordLimiter,UserController.ResetPassword);

//login
router.post("/user/login",createLoginLimiter,UserController.Login);
router.put("/user/UpdateUser",auth,UserController.UpdateUser);
router.put("/user/UpdateUserAddress",auth,UserController.UpdateAddressUser);
router.put("/user/UpdateUserOrderDate",auth,UserController.ChangeOrderDelieveryDate);
router.post("/user/CustomerQueries",auth,UserController.CustomerQueries);
router.post("/user/ReportBug",auth,UserController.ReportaBug);


//activate-plan

module.exports=router;