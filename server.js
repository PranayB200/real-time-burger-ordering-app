require('dotenv').config()

const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

const PORT = process.env.PORT || 3000


app.use(express.json());
app.use(express.urlencoded());

// Dababase conection
const url = 'mongodb://localhost/pizza'
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected..');
}).catch(err => {
    console.log('Connection failed..');
});


// Session store
let mongoStore = new MongoDbStore({
                    mongooseConnection: connection,
                    collection: 'sessions'
                })


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET, // Check .env in the root folder.
    resave: false,
    store: mongoStore, // to store the sessions in the 'mongoStore'
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

app.use(flash())

app.use(express.static('public'))

// Global Middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

// set Template engine
app.use(expressLayout)

app.set('views', path.join(__dirname + '/resources/views'))
app.set('view engine', 'ejs')


// ALL OF THE ROUTES SHOULD COME AFTER SETTING THE VIEW AND LAYOUT. ELSE, THE LAYOUT WON'T WORK.
require('./routes/web.js')(app);

// Run using: yarn dev
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})