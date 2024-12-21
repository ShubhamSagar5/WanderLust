const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const Listing = require('./models/Listing')
const methodoverride = require('method-override')

 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"))


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





app.get("/",(req,res)=>{
    res.send("Hi i am root")
})


//index route 
app.get("/listing",async(req,res)=>{
    
    const allListing = await Listing.find({});

    res.render("listing/index.ejs",{allListing});
})





//render create New form

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs")
})



//show route 

app.get("/listing/:id",async(req,res)=>{
    const {id} = req.params

    const listing = await Listing.findById(id);
 

    res.render("listing/show.ejs",{listing})
})



//add new listing
app.post("/listing",async(req,res)=>{
    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("listing")
})

//find for Edit and Update

app.get("/listing/:id/edit",async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
})

//Edit and Update 

app.put("/listing/:id",async(req,res)=>{
    const {id} = req.params 

    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
})

//Delete Listing

app.delete("/listing/:id/delete",async(req,res)=>{
    const {id} = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
})

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

app.listen(8080,()=>{
    console.log('Server is listen on port number 8080')
})
