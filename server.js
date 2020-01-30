const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");

// Import routers
const usersRoute = require("./routes/users/users");

// Create server using express
const server = express();

// Middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

// Setup paths for routers
server.use("/api/users", usersRoute);

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("connected to DB!")
);

server.get("/", (req, res) => {
  res.json({ message: "The API is up!" });
});

module.exports = server;
