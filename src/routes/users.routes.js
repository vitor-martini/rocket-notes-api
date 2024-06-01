const { Router } = require("express");
const UserController = require("../controllers/UsersController.js")
const UserAvatarController = require("../controllers/UserAvatarController.js")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const usersRoutes = Router();
const usersController = new UserController();
const usersAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update)

module.exports = usersRoutes;