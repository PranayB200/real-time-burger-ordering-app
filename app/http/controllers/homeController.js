const Menu = require('../../models/menu')

function homeController() {
    return {
        index: async function(req, res) { // function should be async to use 'await'
            const pizzas = await Menu.find()
            return res.render('home', { pizzas: pizzas });
        }
    }
}

module.exports = homeController