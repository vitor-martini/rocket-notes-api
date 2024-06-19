const UserService = require("./UserService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError.js");

describe("User service", () => {
  let userRepository = null;
  let userService = null;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory()
    userService = new UserService(userRepository)
  })

  it("should create a user", async () => {
    const user = {
      name: "John",
      email: "john@email.com",
      password: "123"
    }
    const createdUser = await userService.create(user)
    expect(createdUser).toHaveProperty("id")
  })

  it("should not let create a user with a repeated email", async () => {
    const user1 = {
      name: "user1",
      email: "email@email.com",
      password: 123
    }
    const user2 = {
      name: "user2",
      email: "email@email.com",
      password: 321
    }
    await userService.create(user1)
    expect(async () => {
      await userService.create(user2)
    }).rejects.toEqual(new AppError("This e-mail is already on use."))
  })
})