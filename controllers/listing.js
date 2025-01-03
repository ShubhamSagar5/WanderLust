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
   
    const url = req.file.path 
    const fileName = req.file.filename
    const listing = req.body.listing;
  
    const newListing = new Listing(listing);
    newListing.owner = req.user._id
    newListing.image = {url,fileName}
    await newListing.save();
    req.flash("success","New listing Created!")
    res.redirect("/listing")
   
}


//find for Edit and Update
module.exports.getEdit = async(req,res)=>{
    
    const {id} = req.params;
    const listing = await Listing.findById(id);

    let previewImage = listing.image.url
    previewImage = previewImage.replace("/upload","/upload/w_150")
    
    if(!listing){
           req.flash("error","Listing you are requested are not exit")
           res.redirect("/listing")
 
    }
     res.render("listing/edit.ejs",{listing,previewImage});
} 

module.exports.editListing = async(req,res)=>{
    const {id} = req.params 
    const url = req.file.path 
    const fileName = req.file.filename
    
    const updateListing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof(req.file) !== 'undefined'){
        updateListing.image = {url,fileName} 
    }
    updateListing.save()


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