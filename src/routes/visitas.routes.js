const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../helpers/auth");

const { renderVisitasForm } = require("../controllers/visitas.controller");

router.get("/visitas/nuevaVisita",isAuthenticated ,renderVisitasForm); 

module.exports = router;