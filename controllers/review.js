const Listing = require("../models/Listing");
const Review = require("../models/Review");

//Post Review
module.exports.newReview = async(req,res)=>{
    const {id} = req.params
    const {review} = req.body

    const listing = await Listing.findById(id);
    const newReview = new Review(review);
    newReview.author = req.user._id

    await listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created Successfully!")


    res.redirect(`/listing/${id}`)

}

//delete review 

module.exports.destroy = async (req,res)=>{
    const {id,reviewId} = req.params 
    
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}})
    await Review.findByIdAndDelete(reviewId); 
    req.flash("success","Review Deleted Successfully!")

    res.redirect(`/listing/${id}`)
    
}