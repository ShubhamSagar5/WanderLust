const joi = require('joi');

const listingSchema  = joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.allow("",null),
        price:joi.number().required,
        location:joi.string().required(),
        country:joi.string().required()

    }).required()
}) 

const reviewSchemaValidation = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
})


module.exports = {
    listingSchema,
    reviewSchemaValidation
}