const Listing = require("../models/Listing")
const Review = require("../models/Review")

module.exports.isloggedIn = (req,res,next) => {
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You Must be LoggedIn !")
        res.redirect("/login")
    }else{
         next()
    }
   
}

module.exports.saveRedirectUrl = (req,res,next)=>{
   
    if(req.session.redirectUrl){
         
        res.locals.redirectUrl = req.session.redirectUrl
        
    }
    next()
}


module.exports.isOwner = async(req,res,next) => {
    const {id} = req.params 

    const listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You dont nave permission to edit")
        return res.redirect(`/listing/${id}`)
    }

    next()

}


module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params

    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash("error","You dont nave permission to Delete Review")
        return res.redirect(`/listing/${id}`)
    }
    next()
}