const notesCtrl = {};

// Models
const Note = require("../models/Note");

notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};

notesCtrl.createNewNote = async (req, res) => {
  const { title,name,cedula, correo,destino,direccion,telefono,temperatura } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Por favor escriba un nombre de usuario." });
  }
  if (!name) {
    errors.push({ text: "Por favor seleccione una función." });
  }
  if (!cedula) {
    errors.push({ text: "Por favor escriba un numero de identificación" });
  }
  if (!correo) {
    errors.push({ text: "Por favor escriba un correo." });
  }
  if (!destino) {
    errors.push({ text: "Por favor escriba el lugar donde se dirige el usuario." });
  }
  if (!direccion) {
    errors.push({ text: "Por favor escriba la dirección de residencia." });
  }
  if (!telefono) {
    errors.push({ text: "Por favor escriba un telefono de contacto" });
  }
  if (!temperatura) {
    errors.push({ text: "Por favor escriba la temperatura del usuario." });
  }
  /*if (!description) {
    errors.push({ text: "Por favor escriba una descripción." });
  }*/
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      name,
      cedula,
      correo,
      destino,
      direccion,
      telefono,
      temperatura,
      
    });
  } else {
    const newNote = new Note({ title, name, cedula, correo, destino, direccion, telefono, temperatura });
    
    await newNote.save();
    req.flash("success_msg", "Usuario añadido exitósamente.");
    res.redirect("/notes");
  }
};

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find()
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "No autorizado.");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

notesCtrl.updateNote = async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Cambios hechos exitósamente.");
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Usuario eliminado exitósamente.");
  res.redirect("/notes");
};

module.exports = notesCtrl;
