const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const menuSchema = new Schema ({
    name: { type: String, required: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    size: { type: String, required: true}
})

const Menu = mongoose.model('Menu', menuSchema)

// Exporting the menue model to the homeController.js file where the menue will be displayed.
module.exports = Menu