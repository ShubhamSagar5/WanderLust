const express = require('express')
const wrapAsync = require('../utils/wrapAsync')
const Review = require('../models/Review')
const { listingSchema, reviewSchemaValidation } = require('../SchemaValidation')
const Listing = require('../models/Listing')
const router = express.Router({mergeParams:true}) 

const validateReviewSchema = (req,res,next)=>{
    let {error} = reviewSchemaValidation.validate(req.body)
    if(error){
        let collectionOfError = error.details.map((err)=>err.message).join(",");
        throw new ExpressError(400,collectionOfError)
    }else{
        next()
    }
}

router.post("/review",validateReviewSchema,wrapAsync(async(req,res)=>{
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
router.delete("/review/:reviewId",wrapAsync(async (req,res)=>{
    const {id,reviewId} = req.params 
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId); 
    res.redirect(`/listing/${id}`)
    
}))







module.exports = router