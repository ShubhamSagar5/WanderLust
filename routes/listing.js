const express = require('express');
const router = express.Router() 
const wrapAsync = require('../utils/wrapAsync');
const { isloggedIn, isOwner, validateListingSchema } = require('../middleware/user');
const listingController = require("../controllers/listing")
const multer = require('multer')
const {storage} = require("../cloudConfig/cloudinary.js")
const upload = multer({storage})




router.get("/",wrapAsync(listingController.indexPage))


//render create New form

router.get("/new",isloggedIn,listingController.newForm)



//show route 

router.get("/:id",wrapAsync(listingController.showListing))


 
//add new listing
router.post("/",isloggedIn,upload.single("listing[image]"),validateListingSchema,wrapAsync(listingController.addNew))


//find for Edit and Update

router.get("/:id/edit",isloggedIn,wrapAsync(listingController.getEdit))

//Edit and Update 

router.put("/:id/edit",isloggedIn,isOwner,upload.single("listing[image]"),validateListingSchema,wrapAsync(listingController.editListing))

//Delete Listing

router.delete("/:id/delete",isloggedIn,isOwner,wrapAsync(listingController.destroyListing))













module.exports = router