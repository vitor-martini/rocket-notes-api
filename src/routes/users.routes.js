const { Router } = require("express");
const UserController = require("../controllers/UsersController.js")

const usersRoutes = Router();
const userController = new UserController();

function isAdminMiddleware(request, response, next) {
  if (!request.body.isAdmin) {
    return response.status(401).json({message: "Unauthorized!"})
  }

  next();
}

// usersRoutes.use(isAdminMiddleware) // apply the middleware to all routes
usersRoutes.post("/", isAdminMiddleware, userController.create);

module.exports = usersRoutes;