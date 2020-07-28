const express = require("express");

const router = express.Router();
const { check, validationResult } = require('express-validator');
//____
const { isAuthenticated } = require("../helpers/auth");
const { renderVisitasForm, agregarVisita, renderVisitasTable, renderActualizarVisitasForm, salidaVisitas } = require("../controllers/visitas.controller");
const Visita = require("../models/Visita");
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
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los dispponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita'),
], async (req, res) => {
    const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota } = req.body;
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;
        console.log('mensaje de error', errors[0].msg);
        res.render('visitas/nueva_visita', { errors, nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota }); req.session.success = true;
    } else {
        const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota } = req.body;
        //console.log(nombres, "mensaje");
        const newVisita = new Visita({ nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota }); //console.log(nombres," guardar en db")
        await newVisita.save();
        console.log("registro Creado en Visitas");
        req.flash("success_msg", "Entrada Autorisada");
        res.redirect("/visitas/nuevaVisita");
        //res.render("visitas/nueva_visita");
    }
});

router.put("/visitas/actualizar_Visita/:id", isAuthenticated, [

    check('nombres').not().isEmpty().withMessage('Nombre y Apellido son requeridos.').isLength({ min: 3 }).withMessage('Nombre y Apellido corto'),
    check('cedula').not().isEmpty().withMessage('Un numero de cedula es requerido').isLength({ min: 5 }).withMessage('Cedula no valida'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('telefono').not().isEmpty().withMessage('Email es requerido').isLength({ min: 7 }).withMessage('Telefono muy corto').isNumeric().withMessage('No se admiten letras'),
    check('temperatura').not().notEmpty().isNumeric().withMessage('Valor de Temperarura no valido.'),
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los dispponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita'),

], async (req, res) => {
    const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota } = req.body;
    const errors = validationResult(req).array();


    if (errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;

        console.log('mensaje de error', errors[0].msg);
        res.render('visitas/actualizar_visita', { errors, nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota });
        req.session.success = true;
    } else {

        const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota } = req.body;

        await Visita.findByIdAndUpdate(req.params.id, { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota });
        req.flash("success_msg", "Cambios hechos exitósamente.");
        res.redirect("/visitas/Visitas");

    }

});


module.exports = router;