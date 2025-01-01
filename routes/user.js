const express = require('express');
const User = require('../models/User');
const router = express.Router() 
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware/user');
const userController = require("../controllers/user")

router.get("/signup",userController.signupForm)

router.post("/signup",userController.signup)


router.get("/login",userController.loginForm)

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)


router.get("/logout",userController.logout)


module.exports = router