const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')

const PORT = process.env.PORT || 3000


app.use(express.static('public'))

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname + '/resources/views'))
app.set('view engine', 'ejs')


// ALL OF THE ROUTES SHOULD COME AFTER SETTING THE VIEW AND LAYOUT. ELSE, THE LAYOUT WON'T WORK.
app.get('/', (req, res) => {
    res.render('home') // from view folder.
})

app.get('/cart', (req, res) => {
    res.render('customers/cart')
})

app.get('/login', (req, res) => {
    res.render('auth/login')
})

app.get('/register', (req, res) => {
    res.render('auth/register')
})

// Run using: yarn dev
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})