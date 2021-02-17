require("./src/config/mongoose");
const userRouter = require("./src/routers/userRouter");
const jobRouter = require("./src/routers/jobRouter");

const express = require("express");
const cors = require("cors");

// SETUP
const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(cors()); // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.json());
app.use(userRouter);
app.use(jobRouter);

module.exports = app;
