require('dotenv').config()


const Indoor=require("../model/Indoor");
const Outdoor=require("../model/Outdoor");
const Seasonal=require("../model/Seasonal");
const Planter=require("../model/Planters");
const { Mongoose } = require('mongoose');

module.exports={
    async GetIndoorProducts(req,res){
        try{
              const products= await Indoor.find({}).populate('reviews').populate('Customizations').exec()
             return res.status(200).json(products);
          }catch(error){
           return res.status(400).json({message:error});
      }
     },
    async GetOutdoorProducts(req,res){
        try{
              const products= await Outdoor.find({}).populate('reviews').populate('Customizations').exec();
             return res.status(200).json(products);
          }catch(error){
           return res.status(400).json({message:error});
      }
     },
    async GetSeasonalProducts(req,res){
        try{
              const products= await Seasonal.find({}).populate('reviews').populate('Customizations').exec();
             return res.status(200).json(products);
          }catch(error){
              console.log(error)
           return res.status(400).json({message:error});
      }
     },
    async GetPlanterProducts(req,res){
        try{
              const products= await Planter.find({}).populate('reviews').exec();
             return res.status(200).json(products);
          }catch(error){
           return res.status(400).json({message:error});
      }
     },
    //  async UpdateProduct(req,res){
    //     try{
    //         const products= await Item.findById(req.params.id);
    //        return res.status(200).json(products);
    //     }catch(error){
    //      return res.status(400).json({message:error});
    // }
    async UpdateProduct(req,res){
        const {price,quantity,bestselling,sku,type}=req?.body
         let productId=req?.headers?.product_id
         if(productId===null||productId===undefined){
              productId=req?.body?.headers?.product_id
         }
         try{
             let product=await Outdoor.findById(productId)
             if(product===null){
                 product=await Seasonal.findById(productId)
                 if(product===null){
                    product=await Indoor.findById(productId)
                }
             }
             if(product){
                 product.price=price
                 product.quantity=quantity
                 product.type=type
                 product.BestSelling=bestselling
                 product.SKU=sku
                 await product.save()
             }
             return res.status(200).json(product);
         }catch(e){
            return res.status(400).json({message:e});
         }
     },
     async UpdateCustomizationProduct(req,res){
        const {type,custIm1}=req?.body
        console.log(custIm1)
        let planterId=req?.headers?.planter_id

        if(planterId===null||planterId===undefined){
             planterId=req?.body?.headers?.planter_id
        }
         try{
            const data=await Planter.findById(planterId);
            if(type==="indoor"){
                 data.indoorcustomid=[...data.indoorcustomid,custIm1]
                await data.save()
                return res.status(200).json(data);
            }
            if(type==="outdoor"){
                data.outdoorcustomid=[...data.outdoorcustomid,custIm1]
                await data.save()
                return res.status(200).json(data);
            }
            if(type==="seasonal"){
                data.seasonalcustomid=[...data.seasonalcustomid,custIm1]
                await data.save()
                return res.status(200).json(data);
            }
            if(type==="succulent"){
                data.succulentcustomid=[...data.succulentcustomid,custIm1]
                await data.save()
                return res.status(200).json(data);
            }
            return res.status(200).json({message:"product not found"});
         }catch(e){
            return res.status(400).json({message:e});
         }
     }
}