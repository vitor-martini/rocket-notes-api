const { Router } = require("express");
const UserController = require("../controllers/UsersController.js")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

const usersRoutes = Router();
const usersController = new UserController();
usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;