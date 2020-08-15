const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'No autorizado.');
  res.redirect('/users/signin');
};
helpers.isNotAuthenticated =(req,res,next)=>{
	if (!req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/users/signin');
}; 

module.exports = helpers;
