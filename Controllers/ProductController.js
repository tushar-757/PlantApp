require('dotenv').config()


const Indoor=require("../model/Indoor");
const Outdoor=require("../model/Outdoor");
const Seasonal=require("../model/Seasonal");
const Planter=require("../model/Planters");

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
        const {price,quantity,bestselling}=req?.body
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
                 product.BestSelling=bestselling
                 await product.save()
             }
             return res.status(200).json(product);
         }catch(e){
            return res.status(400).json({message:e});
         }
     }
}