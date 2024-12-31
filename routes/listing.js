const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/Listing');
const { reviewSchemaValidation, listingSchema } = require('../SchemaValidation');
const ExpressError = require('../utils/ExpressError');
const { isloggedIn, isOwner } = require('../middleware/user');
const router = express.Router() 



const validateListingSchema = (req,res,next) => {
    const {error} = listingSchema.validate(req.body);
    if(error){
        let collectionOfError = error.details.map((err)=>err.message).join(",");
        
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

router.get("/new",isloggedIn,(req,res)=>{
    res.render("listing/new.ejs")
})



//show route 

router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params
        const listing = await Listing.findById(id).populate("review").populate("owner"); // Pass `id` directly
        
       if(!listing){
        
                req.flash("error","Listing you are requested are not exit")
                res.redirect("/listing")

       }
        res.render("listing/show.ejs", { listing });
     
}))


 
//add new listing
router.post("/",isloggedIn, validateListingSchema,wrapAsync(async(req,res)=>{

    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    newListing.owner = req.user._id
    await newListing.save();
    req.flash("success","New listing Created!")
    res.redirect("/listing")
}))

//find for Edit and Update

router.get("/:id/edit",isloggedIn,wrapAsync(async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
           req.flash("error","Listing you are requested are not exit")
           res.redirect("/listing")
 
    }
     res.render("listing/edit.ejs",{listing});
}))

//Edit and Update 

router.post("/:id",isloggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id} = req.params 
    
    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(!updateListing){
            req.flash("error","Listing you are requested are not exit")
            res.redirect("/listing")

    }
    req.flash("success","Listing Updated Successfully!")


    res.redirect(`/listing/${id}`)
}))

//Delete Listing

router.delete("/:id/delete",isloggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id} = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    if(!deleteListing){
                req.flash("error","Listing you are requested are not exit")
                res.redirect("/listing")

    }
    req.flash("success","Listing Deleted Successfully!")



    res.redirect("/listing")
}))













module.exports = router