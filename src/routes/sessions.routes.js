const { Router } = require("express");
const SessionController = require("../controllers/SessionsController.js");

const sessionsRoutes = Router();
const sessionsController = new SessionController();
sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;