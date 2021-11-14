const express=require("express");
const router = express.Router();
const auth=require("../middlewares/auth")
const AdminController=require("../Controllers/AdminController")

//get users
require('dotenv').config()
router.get("/GetAdminUsers",AdminController.GetUsers);
router.get("/GetAdminOrders",AdminController.GetOrders);
router.get("/GetAdminActiveOrders",AdminController.GetActiveOrders);
router.get("/GetAdminDeliveredOrders",AdminController.GetAdminDelieverOrders);
router.get("/getActiveReviews",AdminController.GetActiveReviewsRequests)
router.put("/HandleReviewRequest",AdminController.HandleReviewRequest)
router.put("/UpdateAdminOrders",AdminController.ChangeOrderStatus);
router.post("/AddIndoorProduct",AdminController.AddIndoorProduct);
router.post("/AddOutdoorProduct",AdminController.AddOutdoorProduct);
router.post("/AddSeasonalProduct",AdminController.AddSeasonalProduct);
router.post("/AddPlanterProduct",AdminController.AddPlanters);
router.post("/UpdateIndoorProduct",AdminController.UpdateIndoorPlants);
router.post("/UpdateOutdoorProduct",AdminController.UpdateOutdoorPlants);
router.post("/UpdateSesonalProduct",AdminController.UpdateSeasonalPlants);
router.delete("/DeleteAdminOrder",AdminController.DeleteOrder);
router.get("/GetOrderByDate",AdminController.GetOrderByDate);
router.get("/GetOredrByUserId",AdminController.GetOrderByUserId);
router.get("/GetCustomerQueries",AdminController.GetUserQueries)
router.get("/GetCustomerBugQueries",AdminController.GetBugReports)
module.exports=router;