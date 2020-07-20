const express = require("express");

const router = express.Router();
const { check, validationResult } = require('express-validator');
//____
const { isAuthenticated } = require("../helpers/auth");
const {validacionDatosIngreso}= require("../helpers/validations");
const { renderVisitasForm, agregarVisita } = require("../controllers/visitas.controller");
const Visita = require("../models/Visita");
//____
router.get("/visitas/nuevaVisita",isAuthenticated ,renderVisitasForm); 

/*router.post("/visitas/nuevaVisita", isAuthenticated,(req, res)=>{
    validacionDatosIngreso(req.body);
    const {nombres,cedula,email,telefono,temperatura,genero,direccion,lugaVisitar,nota} = req.body ;
    console.log(nombres +" guardar en db")

});*/


router.post('/visitas/nuevaVidita',isAuthenticated,
    [
        check('nombres').not().isEmpty().isLength({max: 20}).withMessage('Nombre y Apellido son requeridos'),
        check('cedula').not().isEmpty().isLength({min: 4}).withMessage('Cedula no es valida'),
        check('email', 'Email no es valido').isEmail(),
        check('telefono').not().isEmpty().isLength({max: 10}).withMessage('Numero de telefono es valido')
  
    ], async (req, res) => {
        const errors = validationResult(req).array();
       
        if (errors) {
            req.session.errors = errors;
            req.session.success = false;
            res.render('visitas/nueva_visita',{errors,});
        } else {
            req.session.success = true;
            const newVisita = new Visita( {nombres,cedula,email,telefono,temperatura,genero,direccion,lugaVisitar,nota});
    
            await newVisita.save();
            req.flash("success_msg", "Entrada Autorisada");
            res.redirect("/visitas/nuevaVisita");
            //res.render("visitas/nueva_visita");
        }
    });

module.exports = router;