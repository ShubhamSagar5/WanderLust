const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const Listing = require('./models/Listing')


 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))





app.get("/",(req,res)=>{
    res.send("Hi i am root")
})

app.get("/listing",async(req,res)=>{
    const listing = new Listing({
        title:"aaa",
        description:"ddd",
        price:1200,
        location:"nashik",
        country:"India"
    });

    await listing.save();
   
      
      

    const addNewData = await Listing.insertMany(sampleListings)

    res.send("Listing Added");
})

app.listen(8080,()=>{
    console.log('Server is listen on port number 8080')
})
