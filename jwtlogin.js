var express = require('express')
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken');

var expirySeconds = 120

var app = express()
var user = { id: 111, name: "vijeesh", password: "test123" }
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send("hello world")
})

app.post('/login', (req, res) => {
    if (req.body.username == user.name &&
        req.body.password == user.password) {

        var token = jwt.sign({ user: user.name }, '123456789', { expiresIn: 60 * 2 });
        res.send({
            "token": token
        })
    } else {
        res.send("invalid credentials")
    }
})

function validateToken(req, res, next) {
    console.log(req.headers)
    token = req.headers['authorization']
    console.log(token)
    if (token) {
        try {
            payload = jwt.verify(token, '123456789')
            next()
        } catch (e) {
            console.log(e)
            return res.status(401).end()
        }

    } else {
        res.send("no token")
    }
}

app.get('/refresh', (req, res) => {

    let token = req.headers['authorization']; // Express headers are auto converted to lowercase

    if (!token) {
        return res.status(401).end()
    }

    var payload
    try {
        payload = jwt.verify(token, '123456789')
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }
    // We ensure that a new token is not issued until enough time has elapsed
    // In this case, a new token will only be issued if the old token is within
    // 30 seconds of expiry. Otherwise, return a bad request status
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if (payload.exp - nowUnixSeconds > 120) {
        return res.status(400).end()
    }

    const newToken = jwt.sign({ username: payload.username }, '123456789', {
        algorithm: "HS256",
        expiresIn: expirySeconds,
    })
    res.send({ "token": newToken })
    res.end()
})

app.get('/myaccount', validateToken, (req, res) => {
    res.send("Welcome to your account ")
})

app.listen(3500)