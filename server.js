if (process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv').config({path: __dirname+"\\.env"})
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const express = require("express")
const bodyParser = require("body-parser");
const app = express()
const stripe = require("stripe")(stripeSecretKey)

let userName = ''
let amount = 0

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json())

app.get("/payment", function(req,res){
  res.render("payment")
})

app.post("/",function(req,res){
  userName = req.body.userName;
  const email = req.body.email;
  amount = req.body.amount*100;
  const modeOfPayment = req.body.choice;
  res.render("pay", {
    stripePublicKey: stripePublicKey,
    amount: amount,
    userName: userName
  })
})

app.post("/charge",function(req,res){
  const token = req.body.tokenInput
  stripe.charges.create({
    amount: amount,
    source: token,
    currency: 'INR',
    description: "Donation for Charity",

  }).then(function(){
    console.log("Charge Successfull")
    res.render("success");
  }).catch(function(err){
    console.log("Charge Failure")
    console.log(err)
    res.render("failure");
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port)
{
  console.log("server up and running on port 3000")
}
