const express=require('express');
const mongoose=require('mongoose')
const cors=require("cors");
const app=express();
const UserRouter=require("./Routes/UserRoute");
const Item =require("./model/Item");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url=`mongodb+srv://${process.env.user}:${process.env.password}@cluster0.d93yj.mongodb.net/PlantApp?retryWrites=true&w=majority`;
mongoose.connect(url,{ useNewUrlParser: true ,useUnifiedTopology: true },(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected too db");
    }
})
app.get("/",(req,res)=>{
    res.send("hello")
})

app.use(cors({origin: true, credentials: true}));
app.use(express.json());
// app.set("view engine",'hbs');
// app.use(express.urlencoded({extended:false}))
app.use(UserRouter)

app.post("/plant",async (req,res)=>{
    const {name,type,price,description,images,care,quantity}=req.body;
    try{
        // const user= await User.create({name,email});
       const item=await Item.create({name,type,price,description,images,care,quantity});
       return res.status(201).json(item)
    }catch(e){
        console.log(e);
        return res.status(400).json({message:"failed to save"});
    }
})

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'Thanks for purchasing with us',
//      from: '+17278771267',
//      to: '+919718301199'
//    })
//   .then(message => console.log(message.sid));
//send otp to customer on mobile confirmation
//send otp to customer for recieving package 

const PORT=process.env.port||5000
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('listening on port 5000')
    }
})
