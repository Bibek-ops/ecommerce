const express = require("express");
const app = require("./app");
const cloudinary = require("cloudinary");
// import database
const connectDatabase = require("./db/Database.js");

const dotenv = require("dotenv");
// handling uncaugh Exception
process.on("uncaughtException", (err) => {
  console.log(`Error :${err.message}`);
  console.log("Shutting down the server due to uncaught Exception");
  process.exit(1);
});

// create config
dotenv.config({
  path: "backend/config/config.env",
});

connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//create server

const server = app.listen(process.env.PORT, () => {
  console.log(`server is runnning ${process.env.PORT} `);
});

module.exports= server;

// unhandled Promise Error

process.on("unhandledRejection", (err) => {
  console.log(`error":${err.message}`);
  console.log(`Shutting the the server due to unhandle promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
