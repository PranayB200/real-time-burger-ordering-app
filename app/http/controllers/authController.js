const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return {
        login: function(req, res) {
            res.render('auth/login')
        },

        postLogin(req, res, next) {
            const { email, password } = req.body
            // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect('/')
                })
            })(req, res, next)
        },


        register: function(req, res) {
            res.render('auth/register')
        },

        postRegister: async function(req, res) { // Made this async because the hashing uses 'await'
            const { name, email, password } = req.body

            // Validate the request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register') 
            }

            // Check if email exists
            User.exists({email: email}, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already registered!')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register') 
                }
            })

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Create a User
            const user = new User ({
                name: name,
                email: email,
                password: hashedPassword 
            })

            user.save().then((user) => {
                // Login

                return res.redirect('/') 

            }).catch(err => {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/register') 
            })
        },

        logout: function(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController