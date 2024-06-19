const UserService = require("./UserService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError.js");
const bcrypt = require("bcryptjs");

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

  it("should not update a user if it is not found", async () => {
    const updateObj = { 
      name: "John", 
      email: "john@email.com", 
      password: "123", 
      old_password: "321",
      id: 1
    }

    expect(async () => {
      await userService.update(updateObj);
    }).rejects.toEqual(new AppError("User not found"))
  })

  it("should not let redefine email to a repeated email", async () => {
    const user1 = {
      name: "user1",
      email: "email@email.com",
      password: 123
    }
    await userService.create(user1)
    const user2 = {
      name: "user2",
      email: "john@email.com",
      password: 321
    }
    await userService.create(user2)
    const updateObj = { 
      name: "John", 
      email: "email@email.com",
      id: 2
    }

    expect(async () => {
      await userService.update(updateObj);
    }).rejects.toEqual(new AppError("This email belongs to another user."))
  })

  it("should not let redefine password without both old and new password", async () => {
    const user1 = {
      name: "user1",
      email: "email@email.com",
      password: 123
    }
    await userService.create(user1)
    const updateObj = { 
      password: 123, 
      id: 1
    }
    expect(async () => {
      await userService.update(updateObj);
    }).rejects.toEqual(new AppError("In order to redefine the password you need to inform both the new and old passwords"))
  })

  it("should not let redefine password without the correct old password", async () => {
    const user1 = {
      name: "user1",
      email: "email@email.com",
      password: 123
    }
    await userService.create(user1)
    
    const updateObj = { 
      old_password: 321,
      password: 321,
      id: 1
    }

    expect(async () => {
      await userService.update(updateObj);
    }).rejects.toEqual(new AppError("The old password is invalid."))
  })

  it("should update user data", async () => {
    const user1 = {
      name: "user1",
      email: "email@email.com",
      password: 123
    }
    await userService.create(user1)
    
    const updateObj = { 
      name: "John",
      email: "john@email.com",
      old_password: 123,
      password: 321,
      id: 1
    }
    const updatedUser = await userService.update(updateObj); 
    const checkOldPassword = await bcrypt.compare(updateObj.password.toString(), updatedUser.password)

    expect(updatedUser.name).toBe("John")
    expect(updatedUser.email).toBe("john@email.com")
    expect(checkOldPassword).toBe(true)
  })
})