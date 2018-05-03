const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Form = require('../models/form');
const path = require('path');


//POST method to RECIEVE the list of new fields for a new client 
router.post('/',Admin.ensureAuthenticated, function(req, res){
  var formName = req.body.formName.trim();
  var customerName = req.body.client.trim();
  var errors = {};
  Form.getFormByName(formName, customerName,function(err, form) {
     console.log(JSON.stringify(req.body));
      console.log(form);

      if(err){
        throw err;
      }
      else if(form) {
        errors = [{param: 'formName', msg: 'Form name is already taken', value: '' }];
        res.render('addForm.handlebars', {errors: errors});
      }
      else {
      var newForm = new Form({
      formName: req.body.formName,
      fields: req.body.fields,
      client: req.body.client
          });
      Form.createNewForm(newForm,function(err,form){
      console.log("Success");
       res.redirect('/customer/getForms');
       })
  
      }
      })
    });


module.exports = router;