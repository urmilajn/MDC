const config = require('../config/database');
const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(config.database);    //getting url from config/database.js instead of connecting directly
const db = mongoose.connection;

//Admin Schema
var AdminUserSchema = mongoose.Schema({
	username: {					//same concept as user, but resides in "admins" collection
		type: String,
		required: true,
		unique: true,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: 'Active'
	}
});

var Admin = module.exports = mongoose.model('Admin', AdminUserSchema);	//mongoose understands 'Admin' as 'admins' collection within idm db

module.exports.ensureAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports.getAdminByUsername = function(username, callback){
	var query = {username: username};
	Admin.findOne(query, callback);
}

module.exports.getAdminById = function(id, callback){
	Admin.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.changePassword = function(req, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
	    	var query = {_id: req.session.passport.user};
	        Admin.update(query, {$set: {password: hash}}, callback);
	    });
	});
}