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
}

module.exports = UserService;