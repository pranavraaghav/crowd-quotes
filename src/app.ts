import * as express from "express";
const cors = require("cors");
const db = require("./database/connection");
const routes = require("./routes");
const quotes = require("./routes/quotes.js");
const users = require("./routes/users.js");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yml");

const app = express();

// Migrations
const { migrations } = require("./models/migrations");
migrations()
  .then(() => {
    console.log("Migrations made");
  })
  .catch((err: Error) => {
    console.log("Error while migrating");
    console.log(err.toString());
    process.exit(2);
  });

// Database connection test
db.authenticate()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err: Error) => {
    console.log("Error connecting to DB");
    process.exit(2);
  });

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// Mount routes
app.use("/", routes);
app.use("/api/v1/user", users);
app.use("/api/v1/quote", quotes);

export { app as default };