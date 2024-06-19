const sqliteConnection = require("../database/sqlite");

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM Users WHERE email = ?", [email]);

    return user;
  }

  async findById(id) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
    return user
  }

  async create({ name, email, password }) {
    const database = await sqliteConnection();
    const userId = await database.run(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)", 
      [name, email, password]);

    return { id: userId };
  }

  async update({ user, id }) {
    const database = await sqliteConnection();
    await database.run(
      `UPDATE users SET 
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
       WHERE id = ?
      `, 
      [user.name, user.email, user.password, id])

    return { 
      name: user.name, 
      email: user.email, 
      password: user.password
    }
  }
}

module.exports = UserRepository;