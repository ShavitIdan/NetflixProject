const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_HOST;
const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
};
mongoose
  .connect(url, options)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`Connection error: ${err}`));
