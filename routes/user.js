const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');
const User = require('../models/user');

/** EDIT USER ****************************************************************************************************************************************/

//Get user details for the selected user
router.post('/editUser', Admin.ensureAuthenticated, function(req, res){
	
	var userId = req.body.userId;
	var username = req.body.username;

	res.cookie('userId', userId);	//set current user in cookies

	res.render('editUser.handlebars', {username: username, customerName: req.cookies.customerName, customerLocations: req.cookies.customerLocations});
});

//Save the changes
router.post('/updateUser', Admin.ensureAuthenticated, function(req, res){
	
	//Get updated user details
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	var role = req.body.role;
	var locations = req.body.locations;
	var status = req.body.status;

	//Get cookies
	var userId = req.cookies.userId;
	var customerName = req.cookies.customerName;
	var customerLocations = req.cookies.customerLocations;

	// Validation
	req.checkBody('username', 'Username is required').notEmpty();
	var errors = req.validationErrors();

	if(errors)
		res.render('editUser.handlebars', {errors: errors, customerName: customerName, customerLocations: customerLocations});

	else {
		User.getUserByUsername(username, function(err,user) {

			var updateUser = {};

			if (err) throw err;

			else if(user) {
				if(user._id!=userId) {	//if username is not same as previous, check if username is already taken
					errors = [{param: 'username', msg: 'Username is already taken', value: '' }];
					res.render('editUser.handlebars', {errors: errors, username: username,
														customerName: customerName, customerLocations: customerLocations});
				}
				else {					//it is same user and username, update everything but username
					if(password!='')								//skip if empty
						updateUser.password = password;
					if(role)										//skip if empty
						updateUser.role = role;
					if(locations)									//skip if empty
						updateUser.locations = locations;
					if(status)										//skip if empty
						updateUser.status = status;

					User.updateUserById(userId, updateUser, function(err, result) {		//update to database
						if(err) throw err;
					});

					req.flash('success_msg', 'User details updated successfully');
					res.redirect('/customer/manageUsers');
				}
			}

			else {	//it is same user but different username, update everything
				updateUser.username = username;
				if(password!='')								//skip if empty
					updateUser.password = password;
				if(role)										//skip if empty
					updateUser.role = role;
				if(locations)									//skip if empty
					updateUser.locations = locations;
				if(status)										//skip if empty
					updateUser.status = status;

				User.updateUserById(userId, updateUser, function(err, result) {		//update to database
					if(err) throw err;
				});

				req.flash('success_msg', 'User details updated successfully');
				res.redirect('/customer/manageUsers');
			}
		});	
	}
}); //Updated user

//Cancel update is same as Cancel add

/****************************************************************************************************************************************************/

module.exports = router;