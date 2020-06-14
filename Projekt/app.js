const express = require("express");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const passportConfig = require("./config/passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
//const connection = require("./config/databaseConnection");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/stylesheets"));
app.use(flash());
app.set("view engine", "ejs");


app.use(require("express-session")({
	secret: "pai",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password"}, passportConfig.setLocalStrategy));
passport.serializeUser(passportConfig.serialization);
passport.deserializeUser(passportConfig.deserialization);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(require("./controllers/user"));
app.use(require("./controllers/tournament"));
app.use(require("./controllers/sponsor"));
app.use(require("./controllers/index"));


app.listen(3000, function() {
    console.log("Server is listening on port 3000");
});