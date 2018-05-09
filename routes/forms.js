const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Form = require('../models/form');
const path = require('path');


//POST method to RECIEVE the list of new fields for a new client 
router.post('/',Admin.ensureAuthenticated, function(req, res){
  var formName = req.body.formName;
  var customerName = req.body.client;
      var newForm = new Form({
      formName: req.body.formName,
      fields: req.body.fields,
      client: req.body.client
          });
      Form.createNewForm(newForm,function(err,form){
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