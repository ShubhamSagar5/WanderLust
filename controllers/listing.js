const Listing = require("../models/Listing")


//index
module.exports.indexPage = async(req,res)=>{
    
    const allListing = await Listing.find({});
    
    res.render("listing/index.ejs",{allListing});
}

//render create New form

module.exports.newForm = (req,res)=>{
    res.render("listing/new.ejs")
}

//Single Listing 
module.exports.showListing = async(req,res)=>{
    const {id} = req.params
        const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner"); // Pass `id` directly
  
       if(!listing){ 
        
                req.flash("error","Listing you are requested are not exit")
                res.redirect("/listing")

       }
        res.render("listing/show.ejs", { listing });
     
}


//add new listing
module.exports.addNew  = async(req,res)=>{
console.log("hi")
    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    newListing.owner = req.user._id
    await newListing.save();
    req.flash("success","New listing Created!")
    res.redirect("/listing")
}


//find for Edit and Update
module.exports.getEdit = async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
           req.flash("error","Listing you are requested are not exit")
           res.redirect("/listing")
 
    }
     res.render("listing/edit.ejs",{listing});
} 

module.exports.editListing = async(req,res)=>{
    const {id} = req.params 
    
    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(!updateListing){
            req.flash("error","Listing you are requested are not exit")
            res.redirect("/listing")

    }
    req.flash("success","Listing Updated Successfully!")


    res.redirect(`/listing/${id}`)
}

//delete listing 

module.exports.destroyListing = async(req,res)=>{
    const {id} = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    if(!deleteListing){
                req.flash("error","Listing you are requested are not exit")
                res.redirect("/listing")

    }
    req.flash("success","Listing Deleted Successfully!")



    res.redirect("/listing")
}