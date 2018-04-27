/*const config = require('../config/database');
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(config.database);
const db = mongoose.connection;*/

const mongoose = require('mongoose');

var FormSchema = mongoose.Schema({
	formName : {
		type:String ,
		required:true,
		unique: true,
		index: true
	},
	fields : {
		type:[] 
	},
	client : {
		type:String ,
		required:true
	}
});


var Form = module.exports = mongoose.model('Form',FormSchema);


module.exports.createNewForm = function(newForm , dbResult){
	console.log("Calling Database");
	newForm.save(dbResult);
}