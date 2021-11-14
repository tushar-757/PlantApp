const mongoose =require("mongoose");

const CustomerReviewSchema=new mongoose.Schema({
   likes:{
       type:Number
   },
   username:{
    type:String
   },description:{
       type:String
   },
   approved:{
       type:Boolean,
       default:false
   },
   stars:{
       type:Number,
       required:true
   },userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},indoorid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Indoor"
},outdoorid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Outdoor"
},seasonalid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seasonal"
},Planterid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Planter"
},succulentid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Succulent"
}
})

module.exports=mongoose.model("CustomerReview",CustomerReviewSchema);