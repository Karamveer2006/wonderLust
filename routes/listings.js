const express = require("express");

const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema,}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js")

const {isLoggedIn,isOwner}=require("../middleware.js");
const listingControllers =require("../controllers/listings.js");
const cloudinary=require("cloudinary");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});



const validateListing =async(req,res,next)=>{
    let{error}=await listingSchema.validate(req.body);
    if(error){
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
        }
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
        
    }else{
        next() ;
    }
};



//show all listings
router.route("/")
.get(wrapAsync(listingControllers.index))

//create
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listing/new.ejs");
});

//create rout
router.post("",upload.single("listing[image]"),validateListing,isLoggedIn,wrapAsync(listingControllers.createRoute));


//edit form
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingControllers.editForm));

//update
router.route("/:id")
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingControllers.update))
.get(wrapAsync(listingControllers.showRoute))
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteRoute));

module.exports = router;