const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');

module.exports = function(passport){
	passport.use(new LocalStrategy(
	  function(username, password, done) {
		   Admin.getAdminByUsername(username, function(err, admin){
		   	if(err) throw err;
		   	if(!admin){
		   		return done(null, false, {message: 'Unknown User'});
		   	}

		   	Admin.comparePassword(password, admin.password, function(err, isMatch){
		   		if(err) throw err;
		   		if(isMatch)
		   			return done(null, admin);        
		   		else
		   			return done(null, false, {message: 'Invalid password'});
		   	});
	   });
	}));

	passport.serializeUser(function(admin, done) {
	  done(null, admin.id);
	});

	passport.deserializeUser(function(id, done) {
	  Admin.getAdminById(id, function(err, admin) {
	    done(err, admin);
	  });
	});
}