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
const passport = require('passport')
const Emitter = require('events')

const PORT = process.env.PORT || 3000

// const dbUrl = 'mongodb://localhost/pizza'
const dbUrl = process.env.DB_URL 


app.use(express.json());
app.use(express.urlencoded());

// Dababase conection
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected..');
}).catch(err => {
    console.log('Connection failed..');
});


// Session store
let mongoStore=new MongoDbStore({
    url:dbUrl,
    mongooseConnection:connection,
    touchAfter:24*60*60,
    collection:'sessions',
    secret: process.env.COOKIE_SECRET
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET, // Check .env in the root folder.
    resave: false,
    store: mongoStore, // to store the sessions in the 'mongoStore'
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use(express.static('public'))

// Global Middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Template engine
app.use(expressLayout)

app.set('views', path.join(__dirname + '/resources/views'))
app.set('view engine', 'ejs')


// ALL OF THE ROUTES SHOULD COME AFTER SETTING THE VIEW AND LAYOUT. ELSE, THE LAYOUT WON'T WORK.
require('./routes/web.js')(app);

// Run using: yarn dev
const server = app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => { // Creating private socket rooms for each order ID.
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})