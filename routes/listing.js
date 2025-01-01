const express = require('express');
const router = express.Router() 
const wrapAsync = require('../utils/wrapAsync');
const { isloggedIn, isOwner, validateListingSchema } = require('../middleware/user');
const listingController = require("../controllers/listing")





router.get("/",wrapAsync(listingController.indexPage))


//render create New form

router.get("/new",isloggedIn,listingController.newForm)



//show route 

router.get("/:id",wrapAsync(listingController.showListing))


 
//add new listing
router.post("/",isloggedIn, validateListingSchema,wrapAsync(listingController.addNew))

//find for Edit and Update

router.get("/:id/edit",isloggedIn,wrapAsync(listingController.getEdit))

//Edit and Update 

router.put("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.editListing))

//Delete Listing

router.delete("/:id/delete",isloggedIn,isOwner,wrapAsync(listingController.destroyListing))













module.exports = router