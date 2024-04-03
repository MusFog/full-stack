const express = require('express')
const controller = require('../controllers/feedback')
const passport = require("passport");
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create);
router.put('/:id', passport.authenticate('jwt', {session: false}), controller.updateById)
module.exports = router