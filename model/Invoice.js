const mongoose =require("mongoose");
const validator=require("validator");

const InvoiceSchema=new mongoose.Schema({
    shipping: {
        name: {
            type:String,
            required
        },
        address: {
            type:String,
            required
        },
        city: {
            type:String,
            required
        },
        state: {
            type:String,
            required
        },
        country:{
            default:"India"
        },
        postal_code:{
            type:String
        }
      },
      items: [
        {
          item: {
              type:String
          },
          description: {
              type:String
          },
          quantity: {
              type:Number
          },
          price: {
              type:Number
          },
          tax:{
            type:Number
          }
        }
      ],
      subtotal:{
          type:Number
      },
      total: {
          type:Number
      },
      order_number:{
          type:String
      },
      header:{
          company_name: "THE PETAL GLOW",
          company_logo: "logo.png",
          company_address: "Heavens Green Nursery Sector-80,81 dividing road Opp. of Vipul Plaza Faridabad,Haryana 121004"
      },
      footer:{
        text: "Email:services@thepetalglow.com"
      },
      currency_symbol:"₹",
      date: {
        billing_date:String
      }
})



module.exports= mongoose.model("Invoice",InvoiceSchema);