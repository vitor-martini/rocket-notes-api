const AppError = require("../utils/AppError.js");
const sqliteConnection = require("../database/sqlite");
const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository")
const UserService = require("../services/UserService")

class UsersController {

  async create(request, response) {
    const { name, email, password } = request.body;
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    await userService.create({ name, email, password })

    return response.status(201).json({ name, email, password });
  }
  
  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.user;

    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    await userService.update({ name, email, password, old_password, id })

    return response.json();
  }

}

module.exports = UsersController;