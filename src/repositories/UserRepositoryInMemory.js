class UserRepositoryInMemory {
  users = [];

  async findByEmail(email) {
    return await this.users.find(user => user.email === email)
  }

  async create({ name, email, password }) {
    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      email,
      name,
      password 
    }

    this.users.push(user)

    return { id: user.id };
  }
}

module.exports = UserRepositoryInMemory