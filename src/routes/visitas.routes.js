const express = require("express");

const router = express.Router();
const { check, validationResult } = require('express-validator');
//____
const { isAuthenticated } = require("../helpers/auth");
const { renderVisitasForm, agregarVisita, renderVisitasTable, renderActualizarVisitasForm, salidaVisitas, buscador,buscadorVisitasRecientes } = require("../controllers/visitas.controller");
const Visita = require("../models/Visita");
const VisitaSaliente = require("../models/VisitaSaliente"); 
const visitasCtrl = require("../controllers/visitas.controller");
//____
router.get("/visitas/nuevaVisita", isAuthenticated, renderVisitasForm);
router.get("/visitas/Visitas", isAuthenticated, renderVisitasTable);
router.get("/visitas/actualizarVisita/:id", isAuthenticated, renderActualizarVisitasForm);
router.delete("/visitas/salirVisita/:id", isAuthenticated, salidaVisitas);

router.post('/visitas/nuevaVisita', isAuthenticated, [
    check('nombres').not().isEmpty().withMessage('Nombre y Apellido son requeridos.').isLength({ min: 3 }).withMessage('Nombre y Apellido corto'),
    check('cedula').not().isEmpty().withMessage('Un numero de cedula es requerido').isLength({ min: 5 }).withMessage('Cedula no valida'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('telefono').not().isEmpty().withMessage('Email es requerido').isLength({ min: 7 }).withMessage('Telefono muy corto').isNumeric().withMessage('No se admiten letras'),
    check('temperatura').not().notEmpty().isNumeric().withMessage('Valor de Temperarura no valido.'),
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los disponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita'),
    check('Rol_visitante').not().isEmpty().withMessage('Es necesario escojer un rol de usuario'),
], async (req, res) => {


    const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante } = req.body;
    const errors = validationResult(req).array();
    if(temperatura<34 || temperatura > 38){
       errors.push({msg: "Valor de Temperarura no valido.", value:"",param:"temperatura", location:"body"});
    }

    if (errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;
        console.log('mensaje de error', errors[0].msg);
        res.render('visitas/nueva_visita', { errors, nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante }); 
        req.session.success = true;
    } else {
        const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante } = req.body;
        //console.log(nombres, "mensaje");
        const newVisita = new Visita({ nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante }); //console.log(nombres," guardar en db")
        await newVisita.save();
        console.log("registro Creado en Visitas");
        req.flash("success_msg", "Entrada Autorizada");
        res.redirect("/visitas/Visitas");
        //res.render("visitas/nueva_visita");
    }
});

router.put("/visitas/actualizarVisita/:id", isAuthenticated, [

    check('nombres').not().isEmpty().withMessage('Nombre y Apellido son requeridos.').isLength({ min: 3 }).withMessage('Nombre y Apellido corto'),
    check('cedula').not().isEmpty().withMessage('Un numero de cedula es requerido').isLength({ min: 5 }).withMessage('Cedula no valida'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('telefono').not().isEmpty().withMessage('Email es requerido').isLength({ min: 7 }).withMessage('Telefono muy corto').isNumeric().withMessage('No se admiten letras'),
    check('temperatura').not().notEmpty().withMessage('Valor de Temperarura es requerido').isNumeric().withMessage('Valor de Temperarura no valido.'),
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los disponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita'),
    check('Rol_visitante').not().isEmpty().withMessage('Es necesario escojer un rol de usuario'),

], async (req, res) => {
    
    const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante } = req.body;
    const _id = req.params.id
    const errors = validationResult(req).array();
    if(temperatura<34 || temperatura > 38){
        errors.push({msg: "Valor de Temperarura no valido.", value:"",param:"temperatura", location:"body"});
     }


    if (errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;

        console.log('mensaje de error', errors[0].msg);
        res.render('visitas/actualizar_visita', { errors, _id, nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante });
        req.session.success = true;
    } else {

        const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante } = req.body;

        await Visita.findByIdAndUpdate(req.params.id, { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante });
        req.flash("success_msg", "Cambios hechos exitósamente.");
        res.redirect("/visitas/Visitas");

    }

});

router.post("/visitas/buscador",buscador); 

router.post("/visitas/buscadorVisitasRecientes",buscadorVisitasRecientes); 

module.exports = router;