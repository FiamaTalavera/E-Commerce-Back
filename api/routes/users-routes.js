const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const { generateToken } = require('../config/tokens')



router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    User.findOne({
        where: {
            email,
        },
    }).then((user) => {
        if (!user) return res.send(401).json({message: 'User no encontrado'})

        user.validatePassword(password).then((isValid) => {
            if (!isValid) return res.send(401).json({message: 'Contraseña no validada'})
            else {
                const payload = {
                    email: user.email,
                    name: user.name,
                    last_name: user.last_name
                };
                const token = generateToken(payload)
                res.cookie('token', token)
                res.send(payload)
            }
        })
    })
})
