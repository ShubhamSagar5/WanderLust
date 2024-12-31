const express = require('express');
const User = require('../models/User');
const router = express.Router() 
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware/user');

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})

router.post("/signup",async(req,res,next)=>{
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
})


router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    
    let redirectUrl = res.locals.redirectUrl || "/listing"

    if(redirectUrl){
        req.flash("success","Welcome back To WonderLust")
 res.redirect(redirectUrl);
    }
    
    
})


router.get("/logout",(req,res)=>{
   
    req.logOut((err)=>{
        if(err){
           return next(err)
        }

        req.flash("success","You logout Successfully");
        res.redirect("/listing")
    })    
   
})


module.exports = router