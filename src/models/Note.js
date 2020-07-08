const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    cedula: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true
    },
    destino: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    telefono: {
      type: Number,
      required: true
    },
    temperatura: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: false
    }
    
  },
  {
    timestamps: true
  }
);

module.exports = model("Note", NoteSchema);
