const express=require("express");
const router = express.Router();
const auth=require("../middlewares/auth")
const UserController=require("../Controllers/UserController")

//get users
require('dotenv').config()

router.get("/",(req,res)=>{
    res.render("index")
})

//create order id for razorpay
router.post("/createOrder",auth,UserController.CreateOrder);
router.get("/GetOrders",auth,UserController.GetUserOrder);
router.post("/OrderConfirmation",auth,UserController.OrderConfirmation);

//call back handler for razorpay
//save all info in plan creted with user with user_id
// router.post("/is-order-completed",UserController.AcceptCredentialsRazorPay);

//get loggedin user info
router.get("/user",auth,UserController.GetUser);

//sign-up
router.post("/user/Register",UserController.Register);

//login
router.post("/user/login",UserController.Login);

//check plan before activation
router.post("/user/CHECKPLAN",auth,UserController.CheckOrder);

//activate-plan

module.exports=router;