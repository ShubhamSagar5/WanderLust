//signupForm

const User = require("../models/User")

module.exports.signupForm = (req,res)=>{
    res.render("user/signup.ejs")
}

//signup
module.exports.signup = async(req,res,next)=>{
    try {
        const {username,email,password} = req.body
    
        const newUser = new User({
            email:email,
            username:username
        })
        const newuser = await User.register(newUser,password)
        req.login(newUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome To WonderLust")
        res.redirect("/listing")
        })
        
    
    } catch (error) {
        
        req.flash("error",error.message)
        res.redirect("/user/signup")
    }
}

//loginForm 
module.exports.loginForm = (req,res)=>{
    res.render("user/login.ejs")
}

//login
module.exports.login = async(req,res)=>{
    
    let redirectUrl = res.locals.redirectUrl || "/listing"

    if(redirectUrl){
        req.flash("success","Welcome back To WonderLust")
 res.redirect(redirectUrl);
    }
    
    
}

//logout 
module.exports.logout = (req,res,next)=>{
   
    req.logOut((err)=>{
        if(err){
           return next(err)
        }

        req.flash("success","You logout Successfully");
        res.redirect("/listing")
    })    
   
}