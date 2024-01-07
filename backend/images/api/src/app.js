const express = require("express");
const app = express();

const knex = require("knex");

app.use(express.json());

app.use("/api/recipes", require("./routes/recipes"));
app.use("/api/users", require("./routes/users"));

module.exports = app;
