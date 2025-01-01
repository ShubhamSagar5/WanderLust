const express = require('express')
const wrapAsync = require('../utils/wrapAsync')
const Review = require('../models/Review')
const { listingSchema, reviewSchemaValidation } = require('../SchemaValidation')
const Listing = require('../models/Listing')
const { isloggedIn, isReviewAuthor, validateReviewSchema } = require('../middleware/user')
const router = express.Router({mergeParams:true}) 
const reviewController = require("../controllers/review")

router.post("/review",isloggedIn,validateReviewSchema,wrapAsync(reviewController.newReview))


//Delete Review 
router.delete("/review/:reviewId",isloggedIn,isReviewAuthor,wrapAsync(reviewController.destroy))







module.exports = router