const { Schema, model } = require("mongoose");

const VisitaSchema = new Schema(
{
    nombres: { type: String, required: true },
    cedula: { type: Number, required: true },
    email: { type: String, required: true , default:'Email vacio'},
    telefono: { type: Number, required: true },
    temperatura: { type: Number, required: true },
    genero: { type: String, required: true },
    direccion: { type: String, required: true },
    lugarVisita: { type: String, required: true },
    nota: { type: String, default:'sin Notas'},
    Rol_visitante: { type: String, default:'no especificado'},
    date: { type: Date, default: Date.now },
}); 

module.exports = model("Visita", VisitaSchema);