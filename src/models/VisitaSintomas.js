const { Schema, model } = require("mongoose");

const VisitaSintomasSchema = new Schema(
{
    nombres: { type: String, default:'no especificado' },
    cedula: { type: Number,  default:00000},
    email: { type: String, default:'Email vacio'},
    telefono: { type: Number,  default:00000},
    temperatura: { type: Number,  default:00000},
    direccion: { type: String,default:'no especificado' },
    nota: { type: String, default:'sin Notas'},
    Rol_visitante: { type: String, default:'no especificado'},
    date: { type: Date, default: Date.now },
}); 

module.exports = model("VisitaSintomas", VisitaSintomasSchema);