const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');

//View particular customer
router.get('/', Admin.ensureAuthenticated, function(req, res){
	res.render('customer.handlebars');
});


//Manage Forms - Form Management for particular customer
router.get('/manageForms', Admin.ensureAuthenticated, function(req, res){
	res.render('manageForms.handlebars');
});


//Manage Users - User Management for particular customer
router.get('/manageUsers', Admin.ensureAuthenticated, function(req, res){
	res.render('manageUsers.handlebars');
});


//Add User - Add new user for particular customer
router.get('/addUser', Admin.ensureAuthenticated, function(req, res){
	res.render('addUser.handlebars');
});

//Add User - Add new user for particular customer
router.post('/addUser', Admin.ensureAuthenticated, function(req, res){
	//---- Logic to add user to database
	req.flash('success_msg', 'User added successfully');
	res.redirect('/customer/manageUsers');
});

//Cancel User - Add new user for particular customer
router.post('/cancelUser', Admin.ensureAuthenticated, function(req, res){
	res.render('manageUsers.handlebars');
});

module.exports = router;