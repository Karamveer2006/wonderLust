const Review=require("../models/review.js");
const Listing =require("../models/listing.js");

//post request for review
module.exports.postReview=async(req,res)=>{
         let{id}=req.params;

         let listing=await Listing.findById(id);
         let newReview=new Review(req.body.review);
         newReview.author=req.user._id;

         listing.reviews.push(newReview);
         await newReview.save();
         await listing.save();
          req.flash("success","review created succesfully");
         res.redirect(`/listings/${id}`);

    }

    // delete review
    module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","review deleted succesfully");
    res.redirect(`/listings/${id}`);
}