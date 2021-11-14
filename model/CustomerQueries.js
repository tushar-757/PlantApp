const mongoose =require("mongoose");

const CustomerQueriesSchema=new mongoose.Schema({
   email:{
       type:String,
       required:true
   },
   Active:{
       type:Boolean,
       default:true
   },
   description:{
       type:String,
       required:true
   },
   mobile:{
       type:Number,
       required:true
   }
})

module.exports=mongoose.model("CustomerQueries",CustomerQueriesSchema);