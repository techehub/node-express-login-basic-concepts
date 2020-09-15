var express = require('express')
var bodyparser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session')

var app = express()
var user = { id: 111, name: "vijeesh", password: "test123" }

app.use(session({
    secret: "my secret"
}))

app.use(cookieParser());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send("hello world")
})

app.get('/login', (req, res) => {
    res.send(" <form action ='login' method=post> <input type='text' name='username'> <input type='password' name='pwd'> <input type='submit' value='Login'></form  ")
})

app.post('/login', (req, res) => {
    console.log(req.body.username)

    if (req.body.username == user.name &&
        req.body.pwd == user.password
    ) {
        res.cookie("login_user", user.id);
        req.session.loggedin_user = user
        res.send(" login success ")
    } else {
        res.send("login failed")
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('login_user')
    req.session.loggedin_user = null
    res.redirect('/')
})

function logincheck(req, res, next) {
    //console.log('req.cookies.login_user', req.cookies.login_user)
    //console.log('req.session.loggedin_user.id', req.session.loggedin_user.id)
    if (req.session.loggedin_user == null || (req.cookies.login_user != req.session.loggedin_user.id)) {
        res.redirect("/login")
    } else {
        next()
    }
}

function processing2(req, res, next) {
    req.testid = "215317653"
    next()
}

//app.use(processing2)
//app.use(processing1)

app.get('/content', processing2, logincheck, (req, res) => {
    console.log(req.cookies.login_user)
    res.send(" this is my secure page content")
})

app.get('/test', logincheck, (req, res) => {

    res.send(req.session.loggedin_user)
})

app.listen(3666)