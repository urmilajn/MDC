const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');


//Get customer details from "customers" collection
router.get('/', Admin.ensureAuthenticated, function(req, res){
   	//console.log(req.session.passport.user);
	Customer.getAllCustomers(function (err, results){	//results = customers
		if(err) throw err;
		else
			res.render('dashboard.handlebars', {customers: results});	//send customer details to dashboard for display
	});	
});


//Add new customer
router.post('/', Admin.ensureAuthenticated, function(req, res){
	
	//Get customer name
	var customerName = req.body.customerName;

	//Check if it not empty
	req.checkBody('customerName', 'Enter customer name').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('dashboard.handlebars', {errors: errors});		//if there are validation errors, display dashboard with errors, ensure to check this in the handlebar	

	else {		//if no errors, create new customer object

		//create new customer object (schema as defined in model)
		var newCustomer = new Customer({
			customerName: customerName
		});


		Customer.createCustomer(newCustomer, function(err, customer){	//err, customer are retured data
			if(err) throw err;		//db error
		})

		req.flash('success_msg', 'Customer created');

		res.redirect('/dashboard');		//refresh dashboard
	}
});	//Added new customer


//Change Password
router.get('/changePassword', Admin.ensureAuthenticated, function(req, res){
  res.render('changePassword.handlebars');
});

//Change Password
router.post('/changePassword', Admin.ensureAuthenticated, function(req, res){
	
	//Get new password details
	var newPassword = req.body.newPassword;
	var confirmPassword = req.body.confirmPassword;

	//Check if it not empty and matches
	req.checkBody('newPassword', 'Password is empty').notEmpty();
	req.checkBody('confirmPassword', 'Password does not match').equals(newPassword);
	var errors = req.validationErrors();

	if(errors)
		res.render('changePassword.handlebars', {errors: errors});

	else {
		Admin.changePassword(req, function(err, result){		//result will be empty
			if(err) throw err;
		});

		req.flash('success_msg', 'Password changed successfully');
		res.redirect('/dashboard');
	}
});	//Password Changed

//Change Password - Cancel
router.post('/cancelPassword', Admin.ensureAuthenticated, function(req, res){
	res.redirect('/dashboard');
});

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;