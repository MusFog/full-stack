const express = require('express')
const controller = require('../controllers/news')
const passport = require("passport");
const router = express.Router()


router.post('/:id', passport.authenticate('jwt', {session: false}), controller.addCommentToNews)
module.exports = router