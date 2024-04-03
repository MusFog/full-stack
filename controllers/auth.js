const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        login: req.body.login
    })
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            const token = jwt.sign({
                login: candidate.login,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
            res.status(200).json({
                token: `Bearer ${token}`,
            })
        } else {
            res.status(401).json({
                message: 'Паролі не співпадають'
            })
        }
    } else {
        res.status(404).json({
            message: 'Користувача з таким логіном не знайдено'
        })
    }
}

module.exports.register = async function (req, res) {
    const candidateByLogin = await User.findOne({ login: req.body.login })
    if (candidateByLogin) {
        return res.status(409).json({ message: 'Такий логін вже існує.' })
    }

    const candidateByEmail = await User.findOne({ email: req.body.email })
    if (candidateByEmail) {
        return res.status(409).json({ message: 'Така електронна адреса вже використовується.' })
    }

    const salt = bcrypt.genSaltSync(10)
    const user = new User({
        login: req.body.login,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    })

    try {
        await user.save()
        res.status(201).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}
