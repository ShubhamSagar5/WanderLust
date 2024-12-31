const Listing = require("../models/Listing")

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