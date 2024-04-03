const express = require('express')
const router = express.Router()
const controller = require('../controllers/author')
const passport = require("passport");


router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getNewsByAuthor)
module.exports = router