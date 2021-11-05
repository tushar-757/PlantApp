const express=require("express");
const router = express.Router();
const auth1=require("../middlewares/auth1")
const EmployeeController=require("../Controllers/EmployeeController")

//get users
require('dotenv').config()


router.post("/Employee/Register",EmployeeController.Register);
router.post("/Employee/login",EmployeeController.Login);
router.put("/TakeOrder",auth1,EmployeeController.TakeOrder);
router.get("/GetEmployeeActiveOrders",auth1,EmployeeController.GetEmployeeActiveOrder);
router.put("/SetDelieverd",auth1,EmployeeController.SetOrderDelivered);
module.exports=router;