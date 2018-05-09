const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');
const User = require('../models/user');
const Form = require('../models/form');

/** FOR EACH CUSTOMER: CUSTOMER PAGE ****************************************************************************************************************/

//View particular customer
router.post('/', Admin.ensureAuthenticated, function(req, res){

	var customerId = req.body.customerId;
	var customerName = req.body.customerName;
	var locations = (req.body.locations).split(',');

	res.cookie('customerId', customerId);		//set or reset customer id and name cookies based on customer selected by admin in dashboard
	res.cookie('customerName', customerName);
	res.cookie('customerLocations', locations);

	res.render('customer.handlebars', {customerName: customerName});
});

//Manage Forms - Form Management for particular customer
router.get('/manageForms', Admin.ensureAuthenticated, function(req, res){
	res.render('manageForms.handlebars', {customerName: req.cookies.customerName});
});

//Manage Users - User Management for particular customer
router.get('/manageUsers', Admin.ensureAuthenticated, function(req, res){
	res.render('manageUsers.handlebars', {customerName: req.cookies.customerName});
});

/** ADD USER ****************************************************************************************************************************************/

//Add User - Get
router.get('/addUser', Admin.ensureAuthenticated, function(req, res){
	res.render('addUser.handlebars', {customerName: req.cookies.customerName, locations: req.cookies.customerLocations});
});


//Add User - Process & Reply
router.post('/addUser', Admin.ensureAuthenticated, function(req, res){
	
	//New user details
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	var role = req.body.role;
	var locations = req.body.locations;

	//Get cookies
	var customerId = req.cookies.customerId;
	var customerName = req.cookies.customerName;
	var customerLocations = req.cookies.customerLocations;

	// Validation
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('role', 'Role is required').notEmpty();
	req.checkBody('locations', 'At least one location is required').notEmpty();

	var errors = req.validationErrors();

	if(errors)
		res.render('addUser.handlebars', {errors: errors, customerName: customerName, locations: customerLocations});

	else {
		//Check if username is already taken
		User.getUserByUsername(username, function(err,user) {
			if(err) throw err;

			else if(user) {
				errors = [{param: 'username', msg: 'Username is already taken', value: '' }];
				res.render('addUser.handlebars', {errors: errors, customerName: customerName, locations: customerLocations});
			}

			else {
					var newUser = new User({
						username: username,
						password: password,
						customerId: customerId,
						role: role,
						locations: locations	//status is set to true by default at the db level
					});

				User.createUser(newUser, function(err,result){
					if(err) throw err;
				})

				req.flash('success_msg', 'User added successfully');
				res.redirect('/customer/manageUsers');
			}
		});		
	}
});

//Add user - Cancel
router.post('/cancelUser', Admin.ensureAuthenticated, function(req, res){
	res.render('manageUsers.handlebars', {customerName: req.cookies.customerName});
});

/** GET USERS **************************************************************************************************************************************/

//Get all 'employee' role users from database
router.get('/getEmployees', Admin.ensureAuthenticated, function(req, res){
	User.getUsersByRole('employee', req.cookies.customerId, function (err, results){	//results = managers
		if(err) throw err;
		else
			res.render('manageUsers.handlebars', {users: results, customerName: req.cookies.customerName});
	});
});

//Get all 'manager' role users from database
router.get('/getManagers', Admin.ensureAuthenticated, function(req, res){
	User.getUsersByRole('manager', req.cookies.customerId, function (err, results){	//results = managers
		if(err) throw err;
		else
			res.render('manageUsers.handlebars', {users: results, customerName: req.cookies.customerName});
	});
});

//Get all 'regionalManager' role users from database
router.get('/getRegionalManagers', Admin.ensureAuthenticated, function(req, res){
	User.getUsersByRole('regionalManager', req.cookies.customerId, function (err, results){	//results = managers
		if(err) throw err;
		else
			res.render('manageUsers.handlebars', {users: results, customerName: req.cookies.customerName});
	});
});

/** ADD FORM ****************************************************************************************************************************************/
router.get('/addForm', Admin.ensureAuthenticated, function(req, res){
	Customer.getLocationsByCustomerId(req.cookies.customerId, function(err, result) {
		if (err) throw err;
		else
			res.render('addForm.handlebars', {customerName: req.cookies.customerName, locations: result.locations});
	});
});

// Display added Forms
router.get('/getForms', Admin.ensureAuthenticated, function(req, res){
	Form.getAllFormsByCustomerName(req.cookies.customerName,function (err, results){	//results = managers
		if(err) throw err;
		else{
			res.render('manageForms.handlebars', {forms: results , customerName: req.cookies.customerName});
				
		}
	});
});

/****************************************************************************************************************************************************/

module.exports = router;