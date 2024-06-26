require("dotenv/config");
require("express-async-errors")
const express = require("express"); 
const routes = require("./routes");
const AppError = require("./utils/AppError.js")
const migrationsRun = require("./database/sqlite/migrations")
const uploadConfig = require("./configs/upload.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors()); 
app.use(express.json()); 
app.use(routes)
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
migrationsRun() 

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
  console.log("Server running");
})
