const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError.js");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create({ name, email, password }) {
    const checkUserExists = await this.userRepository.findByEmail(email);
    if(checkUserExists) {
      throw new AppError("This e-mail is already on use.");
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);
    const user = await this.userRepository.create({ name, email, password: hashedPassword })

    return user
  }

  async update({ name, email, password, old_password, id }) {
    const user = await this.userRepository.findById(id);
    if(!user) {
      throw new AppError("User not found");
    }

    const userWithRequestedEmail = await this.userRepository.findByEmail(email);
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

    return await this.userRepository.update({ user, id })
  }
}

module.exports = UserService;