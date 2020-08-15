const router = require("express").Router();
const { check, validationResult } = require('express-validator');

const {
  renderSignUpForm,
  renderSigninForm,
  signin,
  logout
} = require("../controllers/users.controller");
const passport = require("passport"); 

const User = require('../models/User'); 

const { adminAuth } = require("../helpers/userAdmin");
const { isAuthenticated, isNotAuthenticated } = require("../helpers/auth");


// Routes
router.get("/users/signup" ,renderSignUpForm);

router.post("/users/signup", [
  
    check('name').not().isEmpty().withMessage('Un Nombre es requerido').isLength({ min: 3 }).withMessage('Nombre y Apellido corto'),
    check('password').not().isEmpty().withMessage('una contraseña es requerida').isLength({ min: 5 }).withMessage('Contraseña muy corta'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('confirm_password').not().isEmpty().withMessage('confirmar contraseña'),
    
], 
async (req,res) =>{

  const { name, password, email , confirm_password} = req.body ; 
  const errors = validationResult(req).array(); 
  if (!password === confirm_password){
    errors.push({msg: "contraseñas no coinciden ", value:"",param:"password", location:"body"});
  }
  if (errors.length > 0) {
    req.session.errors = errors;
    req.session.success = false;
    console.log('mensaje de error', errors);
    res.render('users/signup', { errors, name , email}); 
    req.session.success = true;
} else {
  console.log('user add'); 
  const newUser = new User({ name, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "Ya estás registrado.");
  res.redirect("/users/signin");

}

})
router.get("/users/signin", renderSigninForm);

router.post("/users/signin", signin);

router.get("/users/logout", logout);

module.exports = router;
