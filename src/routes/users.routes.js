const { Router } = require("express");
const UserController = require("../controllers/UsersController.js")

const usersRoutes = Router();
const userController = new UserController();
usersRoutes.post("/", userController.create);
usersRoutes.put("/:id", userController.update);

// function isAdminMiddleware(request, response, next) {
//   if (!request.body.isAdmin) {
//     return response.status(401).json({message: "Unauthorized!"})
//   }

//   next();
// }

// usersRoutes.use(isAdminMiddleware) // apply the middleware to all routes
//usersRoutes.post("/", isAdminMiddleware, userController.create); // apply the middleware only to the "create" route

module.exports = usersRoutes;