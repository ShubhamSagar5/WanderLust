const express = require('express');
const User = require('../models/User');
const router = express.Router() 
const passport = require("passport")

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})

router.post("/signup",async(req,res)=>{
    try {
        const {username,email,password} = req.body
        console.log(req.body)
        const newUser = new User({
            email:email,
            username:username
        })
        const newuser = await User.register(newUser,password)
        req.flash("success","Welcome To WonderLust")
        res.redirect("/listing")
    
    } catch (error) {
        console.log(error)
        req.flash("error",error.message)
        res.redirect("/user/signup")
    }
})


router.get("/login",(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login",passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),async(req,res)=>{
       req.flash("success","Welcome back To WonderLust")
 res.redirect("/listing");
})

module.exports = router