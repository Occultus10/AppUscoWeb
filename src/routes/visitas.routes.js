const express = require("express");

const router = express.Router();
const { check, validationResult } = require('express-validator');
//____
const { isAuthenticated } = require("../helpers/auth");
const { renderVisitasForm, agregarVisita, renderVisitasTable, renderActualizarVisitasForm, salidaVisitas, buscador,buscadorVisitasRecientes,finJornada } = require("../controllers/visitas.controller");
const Visita = require("../models/Visita");
const VisitaSaliente = require("../models/VisitaSaliente"); 
const VisitaSintomas = require("../models/VisitaSintomas")
const visitasCtrl = require("../controllers/visitas.controller");
//____
router.get("/visitas/nuevaVisita", isAuthenticated, renderVisitasForm);
router.get("/visitas/Visitas", isAuthenticated, renderVisitasTable);
router.get("/visitas/actualizarVisita/:id", isAuthenticated, renderActualizarVisitasForm);
router.delete("/visitas/salirVisita/:id", isAuthenticated, salidaVisitas);

router.post('/visitas/nuevaVisita', isAuthenticated, [
    check('nombres').not().isEmpty().withMessage('Nombre y Apellido son requeridos.').isLength({ min: 3 }).withMessage('Nombre y Apellido corto'),
    check('cedula').not().isEmpty().withMessage('Un numero de cedula es requerido').isLength({ min: 4 }).withMessage('Cedula no valida'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('telefono').not().isEmpty().withMessage('Email es requerido').isLength({ min: 7 }).withMessage('Telefono muy corto').isNumeric().withMessage('No se admiten letras'),
    check('temperatura').not().isEmpty().isNumeric().withMessage('Valor de Temperarura no valido.'),
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los disponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita').not().isIn(['seleccionar']).withMessage('Es necesario escojer un lugar de visita'),
    check('Rol_visitante').not().isEmpty().withMessage('Es necesario escojer un rol de usuario'),
    check("nota").isLength({max:90}).withMessage('Nota muy larga'),
], async (req, res) => {


    const { nombres, cedula, email, telefono, temperatura, genero, direccion, lugarVisita, nota, Rol_visitante } = req.body;
    const errors = validationResult(req).array();



    if (errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;
       
    if(temperatura<= 35){

        const newVisitaSintomas = new VisitaSintomas({ nombres, cedula, email, telefono, temperatura,direccion, nota, Rol_visitante });
        await newVisitaSintomas.save();
        console.log("Datos de sintomas guardados");
        req.flash("success_msg", "Datos de sintomas guardados");
       errors.push({msg: "Valor de Temperatura no válida por ser muy baja. Entrada  NO PERMITIDA", value:"",param:"temperatura", location:"body"},
       {msg: "La Temperatura corporal corresponde a sintomas. DATOS ALMACENADOS PARA REPORTE DE SINTOMAS", value:"",param:"temperatura" ,location:"body"});
    }else if (temperatura >= 38){
        const newVisitaSintomas = new VisitaSintomas({ nombres, cedula, email, telefono, temperatura,direccion, nota, Rol_visitante });
        await newVisitaSintomas.save();
        console.log("Datos de sintomas guardados");
        req.flash("success_msg", "Datos de sintomas guardados");
        errors.push({msg: "Valor de Temperatura no válida por ser muy alta. Entrada  NO PERMITIDA", value:"",param:"temperatura", location:"body"},
        {msg: "La Temperatura corporal corresponde a sintomas. DATOS ALMACENADOS PARA REPORTE DE SINTOMAS", value:"",param:"temperatura" ,location:"body"});
    }
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
    check('cedula').not().isEmpty().withMessage('Un numero de cedula es requerido').isLength({ min: 4 }).withMessage('Cedula no valida'),
    check('email').not().isEmpty().withMessage('Email es requerido').isEmail().withMessage('Email no es valido'),
    check('telefono').not().isEmpty().withMessage('Email es requerido').isLength({ min: 7 }).withMessage('Telefono muy corto').isNumeric().withMessage('No se admiten letras'),
    check('temperatura').not().notEmpty().withMessage('Valor de Temperarura es requerido').isNumeric().withMessage('Valor de Temperarura no valido.'),
    check('genero').not().isEmpty().withMessage('Debe escoger un Genero de los disponibles'),
    check('direccion').not().isEmpty().withMessage('Una Direccion es requerida'),
    check('lugarVisita').not().isEmpty().withMessage('Es necesario escojer un lugar de visita'),
    check('Rol_visitante').not().isEmpty().withMessage('Es necesario escojer un rol de usuario'),
    check("nota").isLength({max:90}).withMessage('Nota muy larga'),
    

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

router.get("/visitas/finJornada", async (req,res)=>{
    const Visitas = await Visita.find()
		.sort({ date: "desc" })
		.lean();
	res.render("visitas/finJornada_visita", { Visitas });
} );

router.post("/visitas/finJornada",finJornada); 

module.exports = router;