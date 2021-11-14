require('dotenv').config()
const express=require("express");
const router = express.Router();
const ProductController=require("../Controllers/ProductController")

router.get("/PlantGiene/IndoorProducts",ProductController.GetIndoorProducts)
router.get("/PlantGiene/OutdoorProducts",ProductController.GetOutdoorProducts)
router.get("/PlantGiene/SeasonalProducts",ProductController.GetSeasonalProducts)
router.get("/PlantGiene/PlanterProducts",ProductController.GetPlanterProducts)
router.get("/PlantGiene/",ProductController.GetSeasonalProducts)
router.put("/PlantGiene/UpdateProduct",ProductController.UpdateProduct)
router.put("/PlantGiene/UpdateCustomProduct",ProductController.UpdateCustomizationProduct)
module.exports=router;