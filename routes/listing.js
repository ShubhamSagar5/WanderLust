const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/Listing');
const { reviewSchemaValidation, listingSchema } = require('../SchemaValidation');
const ExpressError = require('../utils/ExpressError');
const router = express.Router() 



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


router.get("/",wrapAsync(async(req,res)=>{
    
    const allListing = await Listing.find({});

    res.render("listing/index.ejs",{allListing});
}))





//render create New form

router.get("/new",(req,res)=>{
    res.render("listing/new.ejs")
})



//show route 

router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params
        const listing = await Listing.findById(id).populate("review"); // Pass `id` directly
       
  
        res.render("listing/show.ejs", { listing });
     
}))


 
//add new listing
router.post("/",validateListingSchema,wrapAsync(async(req,res)=>{

    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("listing")
}))

//find for Edit and Update

router.get("/:id/edit",wrapAsync(async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    
    res.render("listing/edit.ejs",{listing});
}))

//Edit and Update 

router.put("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params 

    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
}))

//Delete Listing

router.delete("/:id/delete",wrapAsync(async(req,res)=>{
    const {id} = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
}))













module.exports = router