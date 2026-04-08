const Listing =require("../models/listing.js");
const flash=require("connect-flash");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


//index
module.exports.index=async(req,res)=>{
    const allListings =await Listing.find({});
    res.render("listing/index.ejs",{allListings});
}

// create route
module.exports.createRoute=async(req,res)=>{
    
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing =new Listing(req.body.listing);

    newListing.owner=req.user._id;
    newListing.image={url,filename};
    
    await newListing.save();
    req.flash("success","listing created succesfully");
    res.redirect("/listings");

}

// edit form
module.exports.editForm=async(req,res)=>{
     let{id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found ");
        res.redirect("/listings");
    }else{
         res.render("listing/edit.ejs",{listing});
    }
}

// update route
module.exports.update=async(req,res)=>{
     let{id}=req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
     req.flash("success","listing updated succesfully");
    res.redirect(`/listings/${id}`);   
}

// show route
module.exports.showRoute=async(req,res)=>{
    let{id}=req.params;
    const listing =await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    
    if(!listing){
        req.flash("error","listing not found ");
        res.redirect("/listings");
    }else{
         res.render("listing/show.ejs",{listing});
    }
}
// delete route
module.exports.deleteRoute=async(req,res)=>{
    let{id}=req.params;
    const deleteListing =await Listing.findByIdAndDelete(id);
     req.flash("success","listing deleted succesfully");
    res.redirect("/listings");   
}