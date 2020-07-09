const { Schema, model } = require("mongoose");

const VisitaSchema = new Schema(
{
    nombre_apellido: { type: String, required: true },
    cedula: { type: Number, required: true },
    correo: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: Number, required: true },
    temperatura: { type: Number, required: true },
    genero: { type: String, required: true },
    direccion_residencia: { type: String, required: true },
    luegar_visita: { type: String, required: true },
    nota: { type: String, required: true },
    Rol_visitante: { type: String, required:true },
    date: { type: Date, default: Date.now }
}); 

module.exports = model("Visita", VisitaSchema);