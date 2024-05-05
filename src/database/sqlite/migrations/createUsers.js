const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id integer primary key autoincrement,
    name varchar,
    email varchar,
    password varchar,
    avatar varchar NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
  );
`

module.exports = createUsers;