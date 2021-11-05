require('dotenv').config()
const User =require("../model/user");
const Order=require("../model/Order");
const Planter=require("../model/Planters");
const Indoor=require("../model/Indoor");
const Outdoor=require("../model/Outdoor");
const Seasonal=require("../model/Seasonal");
const CustomerReview=require("../model/CustomerReviews");

module.exports={
    async GetUsers(req,res){
        try{
              const orders= await User.find({});
             return res.status(200).json(orders);
          }catch(error){
           return res.status(400).json({message:error});
      }
    },
    async GetOrders(req,res){
      console.log(req.query)
        try{
              const users= await Order.find({}).sort({createdAt:req.query.sortby});
             return res.status(200).json(users);
          }catch(error){
           return res.status(400).json({message:error});
      }
    },
    async GetActiveOrders(req,res){
        try{
              const users= await Order.find({Active:true}).sort({createdAt:req.query.sortby});
             return res.status(200).json(users);
          }catch(error){
           return res.status(400).json({message:error});
      }
    },
    async GetAdminDelieverOrders(req,res){
        try{
              const users= await Order.find({Active:false}).sort({createdAt:req.query.sortby});
             return res.status(200).json(users);
          }catch(error){
           return res.status(400).json({message:error});
      }
    },async ChangeOrderStatus(req,res){
      let {order_id}=req.body?.headers
      const {status}=req.body
      if(order_id===undefined){
         order_id=req?.headers?.order_id
      }
      try{
        const order=await Order.findById(order_id)
        order.status=status
        order.scheduled=true
        await order.save()
       return res.json(order);
    }catch(error){
     return res.status(400).json({message:error});
}
},
async AddIndoorProduct(req,res){
  const { SKU,name,type, description,Images,CustomImages,price,care, quantity ,date} = req.body
				try {
					const event = await Indoor.create({
            SKU,
						name,
            type,
						description,
						images:Images,
						price: parseFloat(price),
						customImages:CustomImages,
            care,
            quantity,
            date
					})

					return res.json(event)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},
async AddOutdoorProduct(req,res){
  const { SKU,name,type, description,Images,CustomImages,price,care, quantity ,date} = req.body
				try {
					const event = await Outdoor.create({
            SKU,
						name,
            type,
						description,
						images:Images,
						price: parseFloat(price),
						customImages:CustomImages,
            care,
            quantity,
            date
					})

					return res.json(event)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},
async AddSeasonalProduct(req,res){
  const { SKU,name,type, description,Images,CustomImages,price,care, quantity ,date} = req.body
				try {
					const event = await Seasonal.create({
            SKU,
						name,
            type,
						description,
						images:Images,
						price: parseFloat(price),
						customImages:CustomImages,
            care,
            quantity,
            date
					})

					return res.json(event)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},async AddPlanters(req,res){
  const { SKU,name,type, description,Images,p1,p2,p3,s1,s2,s3,q1,q2,q3,price,care, quantity ,date} = req.body
				try {
					const event = await Planter.create({
            SKU,
						name,
            type,
						description,
						images:Images,
            varient:{
              s:{
                  price:p1,
                  inches:s1,
                  quantity:q1
              },
              m:{
                  price:p2,
                  inches:s2,
                  quantity:q2
              },
              l:{
                  price:p3,
                  inches:s3,
                  quantity:q3
              },
            },
						price: parseFloat(price),
            care,
            quantity,
            date
					})

					return res.json(event)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},async UpdateIndoorPlants(req,res){
  const { description,images,price,care,quantity} = req.body
   let {Item_id}=req.body?.headers
      if(Item_id===undefined){
         Item_id=req?.headers?.Item_id
      }
				try {
					const foundItem = await Indoor.findById(Item_id)
           foundItem.description=description
           foundItem.care=care
           foundItem.price=price
           foundItem.quantity=quantity
           foundItem.images=images
           await foundItem.save()
					return res.json(foundItem)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},async UpdateOutdoorPlants(req,res){
  const { description,images,price,care,quantity} = req.body
   let {Item_id}=req.body?.headers
      if(Item_id===undefined){
         Item_id=req?.headers?.Item_id
      }
				try {
					const foundItem = await Outdoor.findById(Item_id)
           foundItem.description=description
           foundItem.care=care
           foundItem.price=price
           foundItem.quantity=quantity
           foundItem.images=images
           await foundItem.save()
					return res.json(foundItem)
				} catch (error) {
					return res.status(400).json({ message: error })
				}
},async UpdateSeasonalPlants(req,res){
  const { description,images,price,care,quantity} = req.body
  let {Item_id}=req.body?.headers
     if(Item_id===undefined){
        Item_id=req?.headers?.Item_id
     }
       try {
         const foundItem = await Seasonal.findById(Item_id)
          foundItem.description=description
          foundItem.care=care
          foundItem.price=price
          foundItem.quantity=quantity
          foundItem.images=images
          await foundItem.save()
         return res.json(foundItem)
       } catch (error) {
         return res.status(400).json({ message: error })
       }
},async GetActiveReviewsRequests(req,res){
      try{
           const data=await CustomerReview.find({approved:false})
           return res.json(data)
      }catch(e){
        return res.status(400).json({ message: e })
      }
},async HandleReviewRequest(req,res){
  let {review_id}=req.body?.headers
  const {status}=req.body;
  if(review_id===undefined){
     review_id=req?.headers?.review_id
  }
      try{
        if(status==="approved"){
          const data=await CustomerReview.findById(review_id)
          data.approved=true;
          await data.save();
       		return res.status(201).json(data)
        }
          await CustomerReview.findByIdAndDelete(review_id)
          return res.status(201).json({message:"deleted succesfully"})
     }catch(e){
          return res.status(400).json({ message: e })
     }
},async DeleteOrder(req,res){
  let order_id=req.body?.headers?.order_id
  if(order_id===undefined){
     order_id=req?.headers?.order_id
  }
      try{
           const data=await Order.findByIdAndDelete(order_id)
           return res.status(200).json(data)
      }catch(e){
        return res.status(400).json({ message: e })
      }
},async GetOrderByDate(req,res){
  let {order_id}=req.body?.headers
  const {date}=req.body
  if(order_id===undefined){
     order_id=req?.headers?.order_id
  }
      try{
           const data=await Order.find({createdAt:date})
           return res.status(200).json(data)
      }catch(e){
        return res.status(400).json({ message: e })
      }
},async GetOrderByUserId(req,res){
  let {order_id,user_id}=req.body?.headers
  if(order_id===undefined){
     order_id=req?.headers?.order_id
     user_id=req?.headers?.user_id
  }
      try{
           const data=await Order.find({userid:user_id})
           return res.status(200).json(data)
      }catch(e){
        return res.status(400).json({ message: e })
      }
}

    // async GetOrdersCreatedAt(req,res){
    //     try{
    //           const users= await Order.find({});
    //          return res.status(200).json(users);
    //       }catch(error){
    //        return res.status(400).json({message:error});
    //   }
    // },
    //create item,delete item,update item,update item quantity,
    // async CreateProduct(req,res){
    //   //name type price description images care quantity
    //   const
    //    try{
    //         const product=await Item.create({

    //         })
    //    }catch(e){

    //    }
    // }
}