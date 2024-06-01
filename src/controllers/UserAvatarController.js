const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const { getCurrentDateTime } = require("../utils/Utils");

class UserAvatarController {
  async update(request, response) {
    const userId = request.user.id;
    const avatarFileName = request.file.filename;
    const diskStorage = new DiskStorage();

    const user = await knex("users")
      .where({ id: userId })
      .first();

    if(!user) {
      throw new AppError("User not found");
    }

    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFileName);
    user.avatar = filename;
    user.updated_at = getCurrentDateTime();

    await knex("users")
      .update(user)
      .where({ id: userId });

    return response.json(user);

  }
}

module.exports = UserAvatarController;