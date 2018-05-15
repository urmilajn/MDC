const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Form = require('../models/form');
const path = require('path');


//POST method to RECIEVE the list of new fields for a new client 
router.post('/',Admin.ensureAuthenticated, function(req, res){
  var formName = req.body.formName;
  var customerName = req.body.customer;
  var customerId = req.cookies.customerId;
      var newForm = new Form({
      formName: req.body.formName,
      fields: req.body.fields,
      customer: req.body.customer,
      customerId:req.cookies.customerId
          });
      Form.createNewForm(newForm,function(err,form){
       var formId = form._id
      var tableName =  formName + "_"+ formId;
      Form.createFormTable(tableName,function(err,form){
         if(err) throw err;
      })
             res.redirect('/customer/getForms');
       })

    });

router.post('/checkFormName',Admin.ensureAuthenticated, function(req, res){


  var formName = req.body.formName;
  var customerName = req.body.clientName;

  Form.getFormByName(formName, customerName,function(err, form) {


      if(err){
        throw err;
      }
      else if(form) {
      //form exist with the same name 
        result = {formNameExist : 1}
        res.send(result);
      }
      else{
      //form with with the same does not exist 
        result = {formNameExist : -1}
        res.send(result);
    }
  });
});
module.exports = router;