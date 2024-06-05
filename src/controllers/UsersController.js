const AppError = require("../utils/AppError.js");
const sqliteConnection = require("../database/sqlite");
const bcrypt = require("bcryptjs");

class UsersController {

  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM Users WHERE email = ?", [email]);

    if(checkUserExists) {
      throw new AppError("This e-mail is already on use.");
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);
    database.run(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)", 
      [name, email, hashedPassword]);

    return response.status(201).json({ name, email, password });
  }
  
  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.user;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
    
    if(!user) {
      throw new AppError("User not found");
    }

    const userWithRequestedEmail = await database.get("SELECT * FROM users WHERE email = ?", [email]);
    if (userWithRequestedEmail && userWithRequestedEmail.id !== user.id) {
      throw new AppError("This email belongs to another user.")
    }

    if ((password && !old_password) || (!password && old_password)) {
      throw new AppError("In order to redefine the password you need to inform both the new and old passwords");
    }

    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password.toString(), user.password)

      if(!checkOldPassword) {
        throw new AppError("The old password is invalid.")
      }

      const salt = await bcrypt.genSalt(8);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);
      user.password = hashedPassword;
    }
    
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    database.run(
      `UPDATE users SET 
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
       WHERE id = ?
      `, 
      [user.name, user.email, user.password, id])

    return response.json();
  }

}

module.exports = UsersController;