const express = require('express');
const router = express.Router();
const controller = require("../controllers/subscription");
const passport = require("passport");


router.post('/', passport.authenticate('jwt', {session: false}), controller.createSubscription);


module.exports = router;
