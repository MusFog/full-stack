const express = require('express')
const passport = require('passport')
const controller = require('../controllers/categoryPagination')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)


module.exports = router