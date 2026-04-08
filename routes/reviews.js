const express =require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const flash=require("connect-flash");
const reviewController=require("../controllers/reviews.js");
const ExpressError=require("../utils/ExpressError.js");

const router =express.Router({mergeParams:true});
const{reviewSchema}=require("../schema.js");
const {isLoggedIn ,isreviewAuthor}=require("../middleware.js");

const validateReview =(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}



//post request for review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));


// delete review
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
