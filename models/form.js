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