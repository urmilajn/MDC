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
	customer : {
		type:String ,
		required:true
	},
	customerId : {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});


var Form = module.exports = mongoose.model('Form',FormSchema);


module.exports.createNewForm = function(newForm , dbResult){
	newForm.save(dbResult);
}

module.exports.getAllFormsByCustomerName= function(customerName, result){
	Form.find({customer: customerName},result);	//select customerName,formname from forms where client = ?	//id is by default
}

module.exports.getFormByName = function(formName,customerName, result){
	Form.findOne({formName: formName,customer: customerName}, result);		
		//select * from customers where customerName = ?
}