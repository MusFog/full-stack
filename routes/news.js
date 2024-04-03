const express = require('express')
const controller = require('../controllers/news')
const passport = require("passport")
const router = express.Router()


router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getById);
router.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateById);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.deleteById);
module.exports = router