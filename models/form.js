const mongoose = require('mongoose');

var FormSchema = mongoose.Schema({
	formName : {
		type:String ,
		required:true,
		// unique: true,
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
	newForm.save(dbResult);
}

module.exports.getAllFormsByCustomerName= function(customerName, result){
	Form.find({client: customerName},result);	//select customerName,formname from forms where client = ?	//id is by default
}

module.exports.getFormByName = function(formName,customerName, result){
	Form.findOne({formName: formName,client: customerName}, result);		
		//select * from customers where customerName = ?
}