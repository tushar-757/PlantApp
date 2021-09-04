const express=require("express");
const Plant =require("../model/Plant");
const router = express.Router();

router.post("/plant",async (req,res)=>{
    const {name,type,price,description,images,care,quantity}=req.body;
    try{
        // const user= await User.create({name,email});
       const plant=await Plant.create({name,type,price,description,images,care,quantity});
       return res.status(201).json(plant)
    }catch(e){
        console.log(e);
        return res.status(400).json({message:"failed to save"});
    }
})
router.get("/hello",(req,res)=>{
    res.status(200).json({message:"hello"})
})

module.exports=router;