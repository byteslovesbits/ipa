const express = require("express");
const User = require("../mongoose/models/userModel");
const chalk = require("chalk");

const userRouter = new express.Router();

userRouter.post("/users", async (request, response) => {
  try {
    // Use the json body data from the request to create a user
    const user = new User(request.body);

    const jwt = await user.makeJWT();

    await user.save().then((user) => {
      console.log(chalk.black.bgGreen("Successfully saved user"));
      response.status(201).send({ user, jwt: jwt });
    });
  } catch (error) {
    console.log(chalk.black.bgRed(error));
    console.log(error);

    response.status(400).send(error);
  }
});

// userRouter.get("/userRouterTest", (request, response) => {
//   response.send("/userRouterTest");
// });

module.exports = userRouter;
