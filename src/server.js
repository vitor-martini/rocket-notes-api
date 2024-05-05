require("express-async-errors")
const express = require("express"); 
const routes = require("./routes");
const AppError = require("./utils/AppError.js")
const migrationsRun = require("./database/sqlite/migrations")

const app = express();
const PORT = 3333;

app.use(express.json()); //to interpret JSON on the body
app.use(routes)
migrationsRun() //to create the database and run migrations

//middleware for error handler    
app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.log(error)
  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
})

app.listen(PORT, () => {
  console.log(`Listen on http://localhost:${PORT}`);
})

// //Route Params -> It is required
// //http://localhost:3333/users/22/Vitor
// app.get("/users/:id/:name", (request, response) => {
//   const { id, name } = request.params;
//   response.send(
//     `ID: ${id}
//     Name: ${name}`)
// })

// //Query Params -> It is optional
// //http://localhost:3333/users?page=2&limit=10
// app.get("/users", (resquest, response) => {
//   const { page, limit } = resquest.query

//   response.send(`
//     Page: ${page}
//     Limit: ${limit}
//   `)
// })

// app.post("/users", (request, response) => {
//   const { name, email, password} = request.body;
//   response.send({ name, email, password })
// })

