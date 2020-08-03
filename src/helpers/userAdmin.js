const datosUserAdmin= {};

datosUserAdmin.adminAuth= (req, res, next) => {
    const adminId = "5f1202b83deb6031f8e42d28";
    const userId = req.user.id; 
    if(adminId === userId){
      return next(); 
    } 
    req.flash('error_msg', 'No autorizado.');
      res.redirect('/users/signin');
}


module.exports = datosUserAdmin; 
