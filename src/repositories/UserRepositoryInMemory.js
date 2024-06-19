class UserRepositoryInMemory {
  users = [];

  async findByEmail(email) {
    return await this.users.find(user => user.email === email)
  }

  async create({ name, email, password }) {
    const user = {
      id: this.users.length + 1,
      email,
      name,
      password 
    }

    this.users.push(user)

    return { id: user.id };
  }

  async findById(id) {
    return await this.users.find(user => user.id === id)
  }

  async update({ user, id }) {
    const mockedUser = await this.users.find(user => user.id === id)
    mockedUser.name = user.name
    mockedUser.email = user.email
    mockedUser.password = user.password

    return { 
      name: mockedUser.name, 
      email: mockedUser.email, 
      password: mockedUser.password
    }
  }
}

module.exports = UserRepositoryInMemory