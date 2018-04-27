const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');
const Customer = require('../models/customer');


router.get('/', function(req, res){
   	//console.log(req.session.passport.user);
	var customers;
	Customer.getAllCustomers(function (err, results){	//results = customers
						if(err) throw err;
						else {
							console.log('results ' + results);
							customers = results;
						}
					});
	console.log('var ' + customers);
});

module.exports = router;