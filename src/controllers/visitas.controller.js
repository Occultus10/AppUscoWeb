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

	//const visita = Visita.find({ });
	const Visitas = Visita.find({ cedula: req.body.cedula }, function (err, data) {
		console.log('Errors: ' + err, 'Data length: ', data);

		//console.log('Reportes : ', reportes);
		if (data.length === 0) {
			req.flash("error_msg", "Usuario no encontrado");
			res.redirect("/visitas/Visitas");
		} else {
			const reportes = [];

			for (doc of data) {
				reportes.push(doc);
				for (i = 0; i < 1; i++) {
					const nombres = reportes[i].nombres;
					const cedula = reportes[i].cedula;
					const email = reportes[i].email;
					const id = reportes[i]._id;
					const telefono = reportes[i].telefono
					const temperatura = reportes[i].temperatura
					const genero = reportes[i].genero;
					const direccion = reportes[i].direccion;
					const lugarVisita = reportes[i].lugarVisita
					const nota = reportes[i].nota;
					const date = reportes[i].date;
					const Rol_visitante = reportes[i].Rol_visitante;
					res.render("visitas/busqueda_visita", { nombres, id, cedula, telefono, Rol_visitante, temperatura, direccion, nota, genero, date, lugarVisita, email });
				}
			}
		}
		return data;
	});
};

visitasCtrl.buscadorVisitasRecientes = async (req, res) => {
	const Visitas = VisitaSaliente.find({ cedula: req.body.cedula }, function (err, data) {
		console.log('Errors: ' + err, 'Data length: ', data);

		//console.log('Reportes : ', reportes);
		if (data.length === 0) {
			req.flash("error_msg", "Usuario no encontrado");
			res.redirect("/visitas/nuevaVisita");
		}else{
			const reportes = [];
		for (doc of data) {
			reportes.push(doc)
		}

		for (i = 0; i < 1; i++) {
			const visitNombres = reportes[i].nombres;
			const visitCedula = reportes[i].cedula;
			const visitEmail = reportes[i].email;
			const visitTelefono = reportes[i].telefono;
			const visitGenero = reportes[i].genero;
			const visitDireccion = reportes[i].direccion;
			const visitRol_visitante = reportes[i].Rol_visitante;

			res.render("visitas/nueva_visita", {
				visitNombres,
				visitCedula,
				visitTelefono,
				visitRol_visitante,
				visitDireccion,
				visitGenero,
				visitEmail
			});
		}
		}
	});

	/*const visita = VisitaSaliente.findOne({ cedula: req.body.cedula });
	if (visita) {
		const reportes = [];
		for await (doc of visita) {
			reportes.push(doc)
		}

		for (i = 0; i < 1; i++) {
			const visitNombres = reportes[i].nombres;
			const visitCedula = reportes[i].cedula;
			const visitEmail = reportes[i].email;
			const visitTelefono = reportes[i].telefono;
			const visitGenero = reportes[i].genero;
			const visitDireccion = reportes[i].direccion;
			const visitRol_visitante = reportes[i].Rol_visitante;

			res.render("visitas/nueva_visita", {
				visitNombres,
				visitCedula,
				visitTelefono,
				visitRol_visitante,
				visitDireccion,
				visitGenero,
				visitEmail
			});
		}
	} else {
		req.flash("error_msg", "registro no encontrado");
		res.redirect("visitas/nuevaVisita");
	}*/

};

visitasCtrl.finJornada = async (req, res) => {
	const Visitas = await Visita.find().sort({ date: "desc" }).lean();

	if (Visitas.length ===0) {
		req.flash("error_msg", "No hay nadie para dar salida");
		res.redirect("/visitas/Visitas");
	} else {
		for (i = 0; i < Visitas.length; i++) {
			const nombres = Visitas[i].nombres;
			const cedula = Visitas[i].cedula;
			const email = Visitas[i].email;
			const telefono = Visitas[i].telefono
			const temperatura = Visitas[i].temperatura
			const genero = Visitas[i].genero;
			const direccion = Visitas[i].direccion;
			const lugarVisita = Visitas[i].lugarVisita
			const nota = Visitas[i].nota + "  SALIDA POR FIN DE JORNADA";
			const dateEntrada = Visitas[i].date;
			const Rol_visitante = Visitas[i].Rol_visitante;

			const visitaSaliente = new VisitaSaliente(
				{
					nombres: nombres, cedula, telefono, Rol_visitante, temperatura, direccion, nota, genero, dateEntrada, lugarVisita, email
				}
			);
			await Visita.findByIdAndDelete(Visitas[i]._id);
			if (!visitaSaliente) {
				req.flash("error_msg", "Error de sistema intente de nuevo");
				res.redirect("/visitas/finJornada");
			} else {
				await visitaSaliente.save();
				req.flash("success_msg", "Fin de jornada realizada");
				res.redirect("/visitas/Visitas");
			}
			console.log("registro ", i, visitaSaliente);
		}


	}



};

module.exports = visitasCtrl;