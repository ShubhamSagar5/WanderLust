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