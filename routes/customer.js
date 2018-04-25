const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');

//View particular customer
router.get('/', Admin.ensureAuthenticated, function(req, res){
	res.render('customer.handlebars');
});

//User Management for particular customer
router.post('/manageUsers', Admin.ensureAuthenticated, function(req, res){
	res.render('manageUsers.handlebars');
});

//Form Management for particular customer
router.post('/manageForms', Admin.ensureAuthenticated, function(req, res){
	res.render('manageForms.handlebars');
});

module.exports = router;