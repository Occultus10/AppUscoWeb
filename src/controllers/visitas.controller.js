const visitasCtrl = {};

const Visita = require("../models/Visita");

visitasCtrl.renderVisitasForm = (req, res)=>{ 
    res.render("visitas/nueva_visita"); //Ruta archivo .hbs
};

module.exports = visitasCtrl;