const knex = require("../database/knex");

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const { user_id } = request.params;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });

    const linksToInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    });

    await knex("links").insert(linksToInsert);

    const tagsToInsert = tags.map(tag => {
      return {
        note_id,
        name: tag,
        user_id
      }
    })

    await knex("tags").insert(tagsToInsert);

    response.json();
  }
}

module.exports = NotesController;