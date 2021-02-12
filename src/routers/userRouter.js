const express = require("express");

const userRouter = new express.Router();

userRouter.get("/userRouterTest", (request, response) => {
  response.send("/userRouterTest");
});

module.exports = userRouter;
