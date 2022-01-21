const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Event = require('./models/Event');
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const path = require('path')


mongoose.connect('mongodb+srv://admin:root@cluster0.elh7n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

const app = express();
app.use(history({
    // OPTIONAL: Includes more verbose logging
    verbose: true
}))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(serveStatic(path.join(__dirname, '/dist')))

app.post('/signup', (req, res) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        society : req.body.society,
        first : req.body.first,

        password: bcrypt.hashSync(req.body.password, 10)
    })
    newUser.save(err => {
        if (err) {
            return res.status(400).json({
                title: 'error',
                error: 'email in use'
            })
        }
        return res.status(200).json({
            title: 'signup success'
        })
    })
})

app.post('/newevent', (req, res) => {
    const newEvent = new Event({
        eventid : req.body.eventid,
        name : req.body.name,
        attendance : req.body.attendance,
        eventdate : req.body.eventdate,
        type : req.body.type,
        time : req.body.time,
        picture : req.body.picture,
    })
    newEvent.save(err => {
        if (err) {
            return res.status(400).json({
                title: 'error',
                error: 'eventid in use'
            })
        }
        return res.status(200).json({
            title: 'Event added'
        })
    })
})





app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if (!user) {
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                tite: 'login failed',
                error: 'invalid credentials'
            })
        }
        let token = jwt.sign({ userId: user._id}, 'secretkey');
        return res.status(200).json({
            title: 'login sucess',
            token: token
        })
    })
})

app.get('/user', (req, res) => {
    let token = req.headers.token; //token
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized'
        })

        User.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) return console.log(err)
            return res.status(200).json({
                title: 'user grabbed',
                user: {
                    email: user.email,
                    name: user.name,
                    society : user.society,
                    first : user.first


                }
            })
        })
    })
})

app.get('/event', (req, res) => {

    Event.find({},function (err,eventdb) {
        if (err) return console.log(err);
        else {

            return res.json(eventdb)
        }
    })


})

const port = process.env.PORT || 5001;

app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('server running on port ' + port);
})
