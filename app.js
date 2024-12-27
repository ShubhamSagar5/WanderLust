const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/Listing');
const methodoverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const {listingSchema, reviewSchemaValidation} = require("./SchemaValidation.js");
const Review = require('./models/Review.js');

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

 

const validateListingSchema = (req,res,next) => {
    const {error} = listingSchema.validate(req.body);
    if(error){
        let collectionOfError = error.details.map((err)=>err.message).join(",");
        console.log(error)
        throw new ExpressError(400,collectionOfError);
    }else{
        next()
    }
}

const validateReviewSchema = (req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body)
    if(error){
        let collectionOfError = error.details.map((err)=>err.message).join(",");
        throw new ExpressError(400,collectionOfError)
    }else{
        next()
    }
}

app.get("/",(req,res)=>{
    res.send("Hi i am root")
})


//index route 
app.get("/listing",wrapAsync(async(req,res)=>{
    
    const allListing = await Listing.find({});

    res.render("listing/index.ejs",{allListing});
}))





//render create New form

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs")
})



//show route 

app.get("/listing/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params
    
        const listing = await Listing.findById(id).populate("review"); // Pass `id` directly
       
  
        res.render("listing/show.ejs", { listing });
     
}))


 
//add new listing
app.post("/listing",validateListingSchema,wrapAsync(async(req,res)=>{

    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("listing")
}))

//find for Edit and Update

app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
}))

//Edit and Update 

app.put("/listing/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params 

    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
}))

//Delete Listing

app.delete("/listing/:id/delete",wrapAsync(async(req,res)=>{
    const {id} = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
}))


//Review
//POST 

app.post("/listing/:id/review",validateReviewSchema,wrapAsync(async(req,res)=>{
    const {id} = req.params
    const {review} = req.body

    const listing = await Listing.findById(id);
    const newReview = new Review(review);

    await listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${id}`)

}))


//Delete Review 
app.delete("/listing/:id/review/:reviewId",wrapAsync(async (req,res)=>{
    const {id,reviewId} = req.params 
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId); 
    res.redirect(`/listing/${id}`)
    
}))

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
