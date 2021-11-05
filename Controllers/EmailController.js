require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


module.exports={

async sendwelcomeemail2(email,name){
  const msg = {
    to: email, // Change to your recipient
    from: 'services@thepetalglow.com',
    subject: 'ThePetalGlow',
    text: 'PRODUCT/SERVICE',
    html:`
    <div style="padding:2px;box-shadow:0px 0px 5px lightgrey;margin:10px">
<img src="http://localhost:5000/images/TPGLOGO.png"
style="width:150px;height:150px;padding:0px;padding-bottom:0;margin-bottom:0"/>
<div style="padding:20px;padding-top:0">
    <h1 style="font-size:18px;margin-top:0px">Hello ${name},</h1>
    <p style="font-size:0.8rem">Welcome to ThePetalGlow.</p>
<p style="font-size:0.8rem">ThePetalGlow is your destination for plants,planters and everything in between.we ship our healthy ,happy plants right to your door and and include simple care instructions with every plant</p>
<p style="font-size:0.8rem">to kick start your indoor/outdoor forest,here's 15% off on your first order,just add this discount code to your cart at checkout</p>
<p>In order for a better experience,order tracking and  info download our app from playstore</p>
<img src="http://localhost:5000/images/gp.jpg"
style="height:180px;"/>
<p style="color: #4caf50;">YAY15B_FF06</p>
<div style="background: #009688;
color: white;
height: 25px;
display: flex;
align-items: center;
justify-content: center;">
SHOP PLANTS
</div>
</div>
</div>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
},
   sendOrderInvoiceEmail(recipientEmail,name,order){
    const msg = {
      to: recipientEmail, // Change to your recipient
      from: 'services@thepetalglow.com',
      subject:  `Order Confirmation, ${order?._id}!`,
      text: 'ThePetalGlow',
      html: `
          <head>
  <style>
@font-face {
font-family: 'Poppins';
font-style: normal;
font-weight: 500;
font-display: swap;
src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v9/pxiByp8kv8JHgFVrLGT9Z11lFd2JQEl8qw.woff2) format('woff2');
unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
}
</style></head>
  <body>
  <table style="font-family: 'Poppins', sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0; padding: 0;" bgcolor="#f6f6f6"><tr style=" box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td style=" box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0;" valign="top"></td>

  <td width="600" style=" box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; width: 100% !important; margin: 0 auto; padding: 0;" valign="top">

      <table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Poppins', sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; padding: 0; border: 1px solid #e9e9e9;margin-top:40px;margin-bottom:40px" bgcolor="#fff"><tr style=" box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td style=" box-sizing: border-box; font-size: 16px; vertical-align: top; text-align: left; margin: 0; padding: 30px;padding-top:0px" align="left" valign="top"> <table style="border-box; font-size: 17px; margin: 0; padding: 0;">
                  <tr>
              <td width="600" style=" box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; width: 100% !important; margin: 0 auto; padding: 0;" valign="top">
<img _ngcontent-jvm-c14="" alt="ThePetalGlow" class="" height="184" src="http://localhost:5000/images/TPGLOGO.png" width="184" style="margin-left:-25px;padding:0px"></td></tr>
              </table>
      <p class="text-center" style="margin-top:0px">hi ${name},Use below OTP (One Time Password) for your order verification.</p>
<h2 class="text-center"><span style="color: rgb(45, 44, 241);">${order?.code}</span></h2>
<table>
<tr>
<th>Products</th>
<br><br><th>Qty.</th>
<br><br><th>Price</th>
</tr>
${order?.productsdata?.map((data)=>
`<tr>
<td>${data?.SKU}</td>
<br><br><td>${data?.quantity}</td>
<br><br><td>${data?.price}</td>
</tr>`
)}
</table>
<p>Total:${order?.total}</p>
<p>Regards&nbsp;</p>
<p>ThePetalGlow PRODUCT/SERVICES</p>
<p><strong>&nbsp;</strong>Faridabad&mdash;121003</p>
<p><br><a href=3D"mailto:Email%3Aservices@thepetalglow.com"=
>Email:services@thepetalglow.com</a></p>
          </td>
          </tr>
      </table>

  </td>
  </tr>
</table></body>`
}
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

     }
}