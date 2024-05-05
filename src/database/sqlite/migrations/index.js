const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUsers");

async function migrationsRun() {
  const schemas = [
    createUsers
  ].join("");

  sqliteConnection() //use/create the database if it does not exists
    .then(db => db.exec(schemas)) //create the tables
    .catch(error => console.error(error))
}

module.exports = migrationsRun;