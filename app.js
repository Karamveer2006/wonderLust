if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express=require("express");

const path=require("path");
const app =express();
const methodOverride = require("method-override");

const ExpressError =require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const user=require("./routes/user.js");



const listings =require("./routes/listings.js");
const reviews =require("./routes/reviews.js");






app.engine('ejs',ejsMate);

app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));



const mongoose =require("mongoose");

const MongoStoreFactory = MongoStore.default || MongoStore;




main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {

  await mongoose.connect(process.env.MONGOOSE_url);

  
}

const store = MongoStoreFactory.create({
  mongoUrl: process.env.MONGOOSE_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

    next();
});





app.use("/",user);

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);











app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let{statusCode,message}=err;
    res.render("listing/error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("app is listening to 8080");
    
});