const User=require("../models/user.js");

//signup
module.exports.signup=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);

            }
         req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
        })
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }   
}

//login
module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to Wanderlust");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
        
    })
}