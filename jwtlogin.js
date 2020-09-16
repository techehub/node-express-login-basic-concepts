var express = require('express')
var bodyparser = require('body-parser')
var jwt = require('jsonwebtoken');

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

        var token = jwt.sign({ user: user.name }, '123456789');

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

app.get('/myaccount', validateToken, (req, res) => {
    res.send("Welcome to your account ")
})

app.listen(3666)