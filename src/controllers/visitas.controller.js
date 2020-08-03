const visitasCtrl = {};

const Visita = require("../models/Visita");
const VisitaSaliente = require("../models/VisitaSaliente");
const app = require('../server');
const { body } = require("express-validator");


visitasCtrl.renderVisitasForm = (req, res) => {
	res.render("visitas/nueva_visita"); //Ruta archivo .hbs
};

visitasCtrl.renderVisitasTable = async (req, res) => {

	const Visitas = await Visita.find()
		.sort({ date: "desc" })
		.lean();
	res.render("visitas/Visitas_visita", { Visitas });

};

visitasCtrl.renderActualizarVisitasForm = async (req, res) => {
	const Visitas = await Visita.findById(req.params.id).lean();
	res.render("visitas/actualizar_visita", { Visitas });
};

visitasCtrl.salidaVisitas = async (req, res) => {

	const visita = await Visita.findById(req.params.id).lean();

	const visitaSaliente = new VisitaSaliente({
		nombres: visita.nombres,
		cedula: visita.cedula,
		email: visita.email,
		telefono: visita.telefono,
		genero: visita.genero,
		direccion: visita.direccion,
		temperatura: visita.temperatura,
		lugarVisita: visita.lugarVisita,
		nota: visita.nota,
		Rol_visitante: visita.Rol_visitante,
		dateEntrada: visita.date,
	});
	console.log(visita);
	await visitaSaliente.save();
	await Visita.findByIdAndDelete(visita._id);
	res.redirect("/visitas/Visitas");

};

visitasCtrl.buscador = async (req, res) => {

	const visita = Visita.findOne({ cedula: req.body.cedula });

	if (visita) {

		for await (const doc of visita) {
			const nombres = doc.nombres;
			const cedula = doc.cedula;
			const email = doc.email;
			const id = doc._id;
			const telefono = doc.telefono
			const temperatura = doc.temperatura
			const genero = doc.genero;
			const direccion = doc.direccion;
			const lugarVisita = doc.lugarVisita
			const nota = doc.nota;
			const date = doc.date;
			const Rol_visitante = doc.Rol_visitante;
			res.render("visitas/busqueda_visita", { nombres, id ,cedula,telefono,Rol_visitante, temperatura,direccion,nota,genero,date,lugarVisita,email});
		}


	} else {
		req.flash("error_msg", "registro no encontrado");
		res.render("visitas/busqueda_visita");
	}

};
module.exports = visitasCtrl;