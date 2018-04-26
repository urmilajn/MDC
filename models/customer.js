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

module.exports.createCustomer = function(newCustomer, dbResult){	//newCustomer coming in, result is placeholder function
	//Create newCustomer into Customers collection
	newCustomer.save(dbResult);	//result = err + input customer returned
}

module.exports.getAllCustomers = function(dbResult){
	Customer.find({}).exec(dbResult);
}

module.exports.getCustomerByName = function(customerName, callback){
	var query = {customerName: customerName};
	Customer.findOne(query, callback);
}