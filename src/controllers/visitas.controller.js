const visitasCtrl = {};

const Visita = require("../models/Visita");
const app = require('../server');
//const {validacionDatosIngreso}= require("../helpers/validations");
//const { } = require("../helpers/auth");

visitasCtrl.renderVisitasForm = (req, res)=>{ 
    res.render("visitas/nueva_visita"); //Ruta archivo .hbs
};

/*visitasCtrl.agregarVisita = (req , res) =>{
    // Aqui: guardar ingreso En la DB 
    validacionDatosIngreso(req.body);
    const {nombres,cedula,email,telefono,temperatura,genero,direccion,lugaVisitar,nota} = req.body ;
    console.log(nombres +" guardar en db")

};
*/
module.exports = visitasCtrl;