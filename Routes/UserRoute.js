const express=require("express");
const router = express.Router();
const auth=require("../middlewares/auth")
const UserController=require("../Controllers/UserController");
//get users
require('dotenv').config()
router.get("/",(req,res)=>{
    res.render("index")
})

//create order id for razorpay
router.post("/createOrder",auth,UserController.CreateOrder);
router.get("/GetOrders",auth,UserController.GetUserOrder);
router.put("/OrderConfirmation",auth,UserController.OrderConfirmation);
router.delete("/DeleteOrder",auth,UserController.DeleteOrder);

//call back handler for razorpay
//save all info in plan creted with user with user_id
// router.post("/is-order-completed",UserController.AcceptCredentialsRazorPay);

//get loggedin user info
router.get("/user",auth,UserController.GetUser);
router.post("/userreview",auth,UserController.sendCustomerReviews);
//sign-up
router.post("/user/Register",UserController.Register);
router.delete("/user/DeleteAccount",auth,UserController.DeleteAccount);
router.put("/user/ResetPassword",UserController.ResetPassword);

//login
router.post("/user/login",UserController.Login);
router.put("/user/UpdateUser",auth,UserController.UpdateUser);
router.put("/user/UpdateUserAddress",auth,UserController.UpdateAddressUser);
router.put("/user/UpdateUserOrderDate",auth,UserController.ChangeOrderDelieveryDate);


//activate-plan

module.exports=router;