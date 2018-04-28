const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');

/** DASHBOARD *****************************************************************************************************************************************/

//Get customer details from "customers" collection
router.get('/', Admin.ensureAuthenticated, function(req, res){
   	//console.log(req.session.passport.user);
	Customer.getAllCustomers(function (err, results){	//results = customers
		if(err) throw err;
		else
			res.render('dashboard.handlebars', {customers: results});	//send customer details to dashboard for display
	});	
});

/** ADD CUSTOMER **************************************************************************************************************************************/

//Add new customer - Get
router.get('/addCustomer', Admin.ensureAuthenticated, function(req, res){
	res.render('addCustomer.handlebars');
});

//Add new customer - Process & Reply
router.post('/addCustomer', Admin.ensureAuthenticated, function(req, res){
	
	//Get customer name and locations
	var customerName = req.body.customerName;
	var locations = (req.body.locations).split(',').map(function(item){		//Ex: "Boston, Montreal" --> ["Boston","Montreal"]
		return item.trim();
	});

	//Check if not empty
	req.checkBody('customerName', 'Customer name is required').notEmpty();
	req.checkBody('locations', 'Enter at least one location').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('addCustomer.handlebars', {errors: errors});		//if there are validation errors, display dashboard with errors, ensure to check this in the handlebar	

	else {		//if no validation errors, check if customer already exists, else create one

		//create new customer object (schema as defined in model)
		var newCustomer = new Customer({
			customerName: customerName,
			locations: locations
		});

		Customer.createCustomer(newCustomer, function(err, customer){	//err, customer are retured data
			if(err) throw err;		//db error
		})

		req.flash('success_msg', 'Customer created successfully');
		res.redirect('/dashboard');		//refresh dashboard
	}
});	//Added new customer

//Add new customer - Cancel
router.post('/cancelCustomer', Admin.ensureAuthenticated, function(req, res){
	res.redirect('/dashboard');
});

/** EDIT CUSTOMER DETAILS ****************************************************************************************************************************/

//Edit customer name and/or locations
router.post('/editCustomer', Admin.ensureAuthenticated, function(req, res){
	var customerId = req.body.customerId;		//Need not set other cookies, as we are about to change them
	res.cookie('customerId', customerId);
	res.render('editCustomer.handlebars', {customerName: req.body.customerName, locations: req.body.locations});
});

//Save the changes
router.post('/updateCustomer', Admin.ensureAuthenticated, function(req, res){
	
	//Get updated customer name and locations
	var customerId = req.cookies.customerId;
	var customerName = req.body.customerName;
	var locations = (req.body.locations).split(',').map(function(item){		//Ex: "Boston, Montreal" --> ["Boston","Montreal"]
		return item.trim();
	});

	//Check if not empty
	req.checkBody('customerName', 'Customer name is required').notEmpty();
	req.checkBody('locations', 'Enter at least one location').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('editCustomer.handlebars', {errors: errors});

	else {
		Customer.updateCustomerById(customerId, customerName, locations, function(err, customer){
			if(err) throw err;
		})

		req.flash('success_msg', 'Customer updated successfully');
		res.redirect('/dashboard');		//refresh dashboard
	}
});	//Updated customer

//Cancel update is same as Cancel add

/** CHANGE ADMIN PASSWORD *****************************************************************************************************************************/

//Change Password - Get
router.get('/changePassword', Admin.ensureAuthenticated, function(req, res){
  res.render('changePassword.handlebars');
});

//Change Password - Process & Reply
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

/** LOGOUT ********************************************************************************************************************************************/

//Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

/****************************************************************************************************************************************************/

module.exports = router;