const config = require('../config/database');
const bcrypt = require('bcryptjs');
const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(config.database);    //getting url from config/database.js instead of connecting directly
const db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
	username: {					//unique across the entire idm system
		type: String,
		required: true,
		unique: true,
		index: true
	},
	password: {					//hash value
		type: String,
		required: true
	},
	customerName: {					//lookup from customers
		type: String,
		required: true
	},
	role: {						//static - employee | manager | regionalManager - validated by front end
		type: String,
		required: true
	},
	locations: {				//subset of current-customer > locations
		type: [String],
		required: true
	},
	status: {
		type: Boolean,
		default: true			//true = Active, false = Inactive
	}
});

var User = module.exports = mongoose.model('User', UserSchema);	//mongoose understands 'User' as 'users' collection within idm db

module.exports.createUser = function(newUser, results){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(results);
	    });	
	});
}

module.exports.getUserByRole = function(role, results){
	var query = {role: role};
	User.find(query).exec(results);
}