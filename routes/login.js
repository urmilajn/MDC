const express = require('express');
const router = express.Router();
const passport = require('passport');   //Local Stategy taken from config/passport.js via app.js

/** LOGIN PAGE ***************************************************************************************************************************************/

//login landing page
router.get('/', function(req, res){
	res.render('login.handlebars');
});

//login request - authenticate admin
router.post('/',
	passport.authenticate('local',{successRedirect:'/dashboard', failureRedirect: '/login', failureFlash: true}),
	function(req, res) {
		res.redirect('/dashboard');
});

/*****************************************************************************************************************************************************/

module.exports = router;