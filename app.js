require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const connectFlash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const sessionStorage = require("express-session");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/User.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Db connected sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("Hi i am root");
});


const sessionOption = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: true,
};



app.use(sessionStorage(sessionOption));
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user
  next();
});

app.use("/listing", listingRouter);
app.use("/listing/:id", reviewRouter);
app.use("/",userRouter)

// app.get("/listing",async(req,res)=>{
//     const listing = new Listing({
//         title:"aaa",
//         description:"ddd",
//         price:1200,
//         location:"nashik",
//         country:"India"
//     });

//     await listing.save();

//     const addNewData = await Listing.insertMany(sampleListings)

//     res.send("Listing Added");
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("listing/Error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listen on port number 8080");
});
