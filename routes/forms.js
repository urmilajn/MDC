const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const path = require('path');


router.get('/', function(req, res){
   console.log("inside create new form page");
   res.sendFile(path.join(__dirname, '../views','/createNewForm.html'));

})

//POST method to RECIEVE the list of new fields for a new client 
router.post('/', function(req, res){
   console.log("inside getFielldsOfNewForm");
		console.log(JSON.stringify(req.body));

    var newForm = new Form({
      formName: req.body.formName,
      fields: req.body.fields,
      client: req.body.client
    });
    Form.createNewForm(newForm,function(err,form){
      console.log("Success");
    })
res.send('');
})


module.exports = router;