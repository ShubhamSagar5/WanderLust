const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const connectFlash = require('connect-flash')

const listing = require("./routes/listing.js")
const review = require("./routes/review.js")
const sessionStorage = require('express-session')

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate)


main()
.then(()=>{
    console.log("Db connected sucessfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
} 

 const sessionOption = {
secret:"thisismysecret",
    resave:false,
    saveUninitialized:true
 }
app.get("/",(req,res)=>{
    res.send("Hi i am root")
})
 app.use(sessionStorage(sessionOption))
 app.use(connectFlash())

 app.use((req,res,next)=>{
    res.locals.success = req.flash("success") 
    res.locals.error = req.flash("error")
    next()
 })


app.use("/listing",listing)
app.use("/listing/:id",review)







// app.get("/listing",async(req,res)=>{
//     const listing = new Listing({
//         title:"aaa",
//         description:"ddd",
//         price:1200,
//         location:"nashik",
//         country:"India"
//     });

//     await listing.save();
   
      
      

//     const addNewData = await Listing.insertMany(sampleListings)

//     res.send("Listing Added");
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    const {statusCode =500,message="somthing went wrong"} = err
    res.render("listing/Error.ejs",{message})
    
})



app.listen(8080,()=>{
    console.log('Server is listen on port number 8080')
})
