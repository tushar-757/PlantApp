const express=require('express');
const mongoose=require('mongoose')
const serverless = require('serverless-http');
const cors=require("cors");
const app=express();
const UserRouter=require("./Routes/UserRoute");
const AdminRouter=require("./Routes/AdminRoutes");
const EmployeeRouter=require("./Routes/EmployeeRoutes");
const ProductRouter=require('./Routes/ProductRoutes');
const rateLimit = require("express-rate-limit")

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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per windowMs
  });
app.use(limiter);

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    console.log(req.ip,req.url)
    // res.setHeader('Access-Control-Allow-Origin', 'https://thepetalglow.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
   if(req.hostname==="api.thepetalglow.com"){
       console.log(req)
    console.log(req.hostname+"hostname")
        next();
    }else{
        console.log(req.hostname+"hostname")
        res.send("Access Denied")
    }
  });
app.get("/",(req,res)=>{
    res.send("hello")
})


app.use(express.json());
app.use('/images', express.static('static'))
// app.set("view engine",'hbs');
// app.use(express.urlencoded({extended:false}))
app.use(AdminRouter)
app.use(UserRouter)
app.use(ProductRouter)
app.use(EmployeeRouter)

// app.post("/plant",async (req,res)=>{
//     const {name,type,price,description,images,care,quantity}=req.body;
//     try{
//         // const user= await User.create({name,email});
//        const item=await Item.create({name,type,price,description,images,care,quantity});
//        return res.status(201).json(item)
//     }catch(e){
//         console.log(e);
//         return res.status(400).json({message:"failed to save"});
//     }
// })

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'Thanks for purchasing with us',
//      from: '+17278771267',
//      to: '+919718301199'
//    })
//   .then(message => console.log(message.sid));
//send otp to customer on mobile confirmation
//send otp to customer for recieving package

const PORT=process.env.PORT ||5000
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('listening on port 5000')
    }
})
// module.exports.handler = serverless(app);