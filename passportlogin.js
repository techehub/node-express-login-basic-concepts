var express = require('express')
var bodyparser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


var app = express()
var users = [{ id: 111, name: "vijeesh", password: "test123" }]

passport.serializeUser(function(user, done) {
    done(null, users[0].id);
});

passport.deserializeUser(function(id, done) {
    done(null, users[0]);
});


// passport local strategy for local-login
passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pw'
    },
    function(username, password, done) {

        try {
            if (username === users[0].name && password === users[0].password) {
                return done(null, users[0]);
            } else {
                return done(null, false, { "message": "User not found." });
            }
        } catch (e) {
            done(err)
        }
    }));

app.use(session({
    secret: "my secret",
    resave: true,
    saveUninitialized: true

}))
app.use(cookieParser());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

app.get("/", function(req, res) {
    res.send("Hello world");
});

app.get("/login", function(req, res) {
    res.send("<p>Please login </p><form method='post' action='/login'><input type='text' name='email'/><input type='password' name='pw'/><button type='submit' value='submit'>Submit</buttom></form>");
});

app.post("/login",
    passport.authenticate("local-login", { failureRedirect: "/login" }),
    function(req, res) {
        res.redirect("/content");
    });

app.get("/content", isLoggedIn, function(req, res) {
    res.send("<b>This is my secure page content<b><form action='logout'><input type='submit' value='logout'></form>");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.send("logout success!");
});

app.listen(3000)