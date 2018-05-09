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
	var customerName = req.body.customerName.trim();
	var locations = (req.body.locations).split(',').map(function(item){		//Ex: "Boston, Montreal" --> ["Boston","Montreal"]
		return item.trim();
	});

	//Get cookies
	var customerId = req.cookies.customerId;

	//Check if not empty
	req.checkBody('customerName', 'Customer name is required').notEmpty();
	req.checkBody('locations', 'Enter at least one location').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('addCustomer.handlebars', {errors: errors});		//if there are validation errors, display dashboard with errors, ensure to check this in the handlebar	

	else {		//if no validation errors, check if customer already exists, else create one

		Customer.getCustomerByName(customerName, function(err, customer) {

			var updateCustomer = {};

			console.log(customer);

			if(err) throw err;

			else if(customer) {
				errors = [{param: 'username', msg: 'Customer name is already taken', value: '' }];
				res.render('addCustomer.handlebars', {errors: errors});
			}

			else {
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
		});
	}
});	//Added new customer

//Add new customer - Cancel
router.post('/cancelCustomer', Admin.ensureAuthenticated, function(req, res){
	res.redirect('/dashboard');
});

/** EDIT CUSTOMER DETAILS ****************************************************************************************************************************/

//Edit customer name and/or locations
router.post('/editCustomer', Admin.ensureAuthenticated, function(req, res){
	var customerId = req.body.customerId;
	res.cookie('customerId', customerId);
	res.render('editCustomer.handlebars', {customerName: req.body.customerName, locations: req.body.locations});
});

//Save the changes
router.post('/updateCustomer', Admin.ensureAuthenticated, function(req, res){
	
	//Get updated customer name and locations
	var customerId = req.cookies.customerId;
	var customerName = req.body.customerName.trim();
	var locations = (req.body.locations).split(',').map(function(item){		//Ex: "Boston, Montreal" --> ["Boston","Montreal"]
		return item.trim();
	});

	//Check if not empty
	req.checkBody('customerName', 'Customer name is required').notEmpty();
	req.checkBody('locations', 'Enter at least one location').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('editCustomer.handlebars', {errors: errors});	//on error fill in correct data, or cancel and comeback to see prev data

	else {      //if no validation errors, check if customer already exists, else create one

        Customer.getCustomerByName(customerName, function(err, customer) {

            var updateCustomer = {};

            if(err) throw err;

            else if(customer) {
                if(customer._id!=customerId){   //if customer name is not same as previous, check if customer name is already taken
                    errors = [{param: 'username', msg: 'Customer name is already taken', value: '' }];
                    res.render('addCustomer.handlebars', {errors: errors});
                }
                else {
                    updateCustomer.locations = locations;
                    Customer.updateCustomerById(customerId, updateCustomer, function(err, result) {     //update to database
                        if(err) throw err;
                    });
                    req.flash('success_msg', 'Customer updated successfully');
					res.redirect('/dashboard');		//refresh dashboard
                }
            }

            else {
                updateCustomer.customerName = customerName;
                updateCustomer.locations = locations;
                Customer.updateCustomerById(customerId, updateCustomer, function(err, result) {     //update to database
                    if(err) throw err;
                });
                req.flash('success_msg', 'Customer updated successfully');
				res.redirect('/dashboard');		//refresh dashboard
            }
        });
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
	var newPassword = req.body.newPassword.trim();
	var confirmPassword = req.body.confirmPassword.trim();

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
	res.clearCookie('cstomerId');	res.clearCookie('customerName');	res.clearCookie('customerLocations');
	res.clearCookie('userId');			//clear all created cookies at logout
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
});

/****************************************************************************************************************************************************/

module.exports = router;