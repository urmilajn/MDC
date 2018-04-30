const mongoose = require('mongoose');

//Customer Schema
var CustomerSchema = mongoose.Schema({
	customerName: {			//unique across entire idm system
		type: String,
		required: true,
		unique: true,
		index: true
	},
	locations: {			//admin must provide the list of locations for a given customer
		type: [String],
		required: true
	}
});

//Make model available to other files by exporting, also store in var Customer for local use
var Customer = module.exports = mongoose.model('Customer', CustomerSchema);		//refers to "customers" collection in the database

module.exports.createCustomer = function(newCustomer, result){	//newCustomer coming in, result is placeholder function
	//Create newCustomer into Customers collection
	newCustomer.save(result);	//result = err + input customer returned
}

module.exports.updateCustomerById = function(id, newCustomer, result){
	Customer.update({_id: id}, {$set: newCustomer}, result);
}

module.exports.getAllCustomers = function(result){
	Customer.find({}, result);			//select * from customers
	//Customer.find({}).exec(result);	//alternate way
}

module.exports.getCustomerByName = function(customerName, result){
	Customer.findOne({customerName: customerName}, result);			//select * from customers where customerName = ?
}


module.exports.getLocationsByCustomerId = function(id, result){
	Customer.findById(id, 'locations', result);		//select id,locations from customers where id = ?	//id is by default
}