const express = require("express");
const User = require("../mongoose/models/userModel");
const chalk = require("chalk");
const authenticateUser = require("../middleware/authenticateUser");

const userRouter = new express.Router();

userRouter.post("/users", async (request, response) => {
  try {
    // Use the json body data from the request to create a user
    const user = new User(request.body);

    const token = await user.makeJWT();

    await user.save().then((user) => {
      console.log(chalk.black.bgGreen("Successfully saved user"));
      response.status(201).send({ user, token: token });
    });
  } catch (error) {
    console.log(chalk.black.bgRed(error), error);
    response.status(400).send(error);
  }
});

userRouter.post("/users/login", async (request, response) => {
  try {
    const user = await User.findUser(request.body.email, request.body.password);
    response.send({ user, token: await user.makeJWT() });
  } catch (error) {
    console.log(chalk.black.bgRed(error), error);
    response.status(400).send(error);
  }
});

userRouter.post(
  "/users/logout",
  authenticateUser,
  async (request, response) => {
    try {
      request.user.tokens = request.user.tokens.filter((token) => {
        return token.token !== request.token;
      });

      try {
        await request.user.save();
        response.sendStatus(200);
      } catch (error) {
        console.log(chalk.black.bgRed(error), error);
        response.send("error: could not save resource");
      }
    } catch (error) {
      console.log(chalk.black.bgRed(error), error);
      response.sendStatus(500);
    }
  }
);

userRouter.post(
  "/users/logoutall",
  authenticateUser,
  async (request, response) => {
    // The user is authenticated through the middleware so wipe the tokens array
    // We attached the user to the request object within authenticateUser
    try {
      request.user.tokens = [];
      await request.user.save();
      console.log(
        chalk.black.bgGreen("Successfully logged out of all sessions")
      );
      response.sendStatus(200);
    } catch (error) {
      console.log(chalk.black.bgRed(error), error);
      response.status(500).send(error);
    }
  }
);

userRouter.get("/users/myProfile", authenticateUser, (request, response) => {
  // User is authenticated and the user has been attached to the request object within authenticate user
  console.log(chalk.black.bgGreen("User data"));
  console.log(request.user);
  response.send(request.user);
});

userRouter.delete(
  "/users/myProfile",
  authenticateUser,
  async (request, response) => {
    try {
      await request.user.remove();
      response.sendStatus(200);
      console.log(chalk.black.bgGreen("Successfully deleted user"));
    } catch (error) {
      console.log(chalk.black.bgRed(error));
      console.log(error);
      response.sendStatus(500);
    }
  }
);

module.exports = userRouter;
