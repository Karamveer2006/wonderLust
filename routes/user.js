const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const flash=require("connect-flash");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControllers=require("../controllers/users.js");

//signup

router.route("/signup")
.get((req,res)=>{
    res.render("user/signup.ejs");
})
.post(wrapAsync(userControllers.signup));



//login

router.route("/login")
.get((req,res)=>{
    res.render("user/login.ejs");
})
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
wrapAsync(userControllers.login));


//logout

router.get("/logout",userControllers.logout);

module.exports=router;