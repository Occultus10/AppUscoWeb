const datosUserAdmin= {};

datosUserAdmin.adminAuth= (req, res, next) => {
    const adminId = "5f04d7b36367d0432cce7e7b";
    const adminId1 = "5f2328add8e4d8341069e38c";
    const userId = req.user.id; 
    if(adminId === userId || adminId1 === userId){
      return next(); 
    } 
    req.flash('error_msg', 'No autorizado.');
      res.redirect('/users/signin');

}


module.exports = datosUserAdmin; 
