require("./src/config/mongoose");
const userRouter = require("./src/routers/userRouter");

const express = require("express");
const cors = require("cors");

// SETUP

const app = express();
app.use(express.json());
app.use(userRouter);

app.use(cors()); // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(express.urlencoded({ extended: false }));

module.exports = app;
