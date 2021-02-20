const express = require("express");
const User = require("../mongoose/models/userModel");
const chalk = require("chalk");
const authenticateUser = require("../middleware/authenticateUser");
const sendEmail = require("../sendgrid/sendgrid");
const {green, red, success,err} = require("../helpers/helpers")



const userRouter = new express.Router();

// CREATE
userRouter.post("/users", async (request, response) => {
  try {
    // Use the json body data from the request to create a user
    const user = new User(request.body);

    const token = await user.makeJWT();

    await user.save().then((user) => {
      try {
        sendEmail(user.email, user.name, "signup");
        success(green("Successfully saved user"))
          success(green("Successfully sent signup email"))
      } catch (error) {
          err(red("Could not send Welcome email"), error)
      }

      // Lockdown what is sent back to the user-agent
      const User = user.toObject()
        delete User.password
        delete User.tokens

        response.status(201).send({ User, token: token });
    });
  } catch (error) {
    err(red(error), error)
    response.status(400).send(error);
  }
});
userRouter.post("/users/login", async (request, response) => {
  try {
    const user = await User.findUser(request.body.email, request.body.password);
    response.send({ user, token: await user.makeJWT() });
  } catch (error) {
      err(red(error), error)
      response.status(400).send(error);
  }
});
userRouter.post("/users/logout", authenticateUser, async (request, response) => {
    try {
      request.user.tokens = request.user.tokens.filter((token) => {
        return token.token !== request.token;
      });

      try {
        await request.user.save();
        response.sendStatus(200);
      } catch (error) {
          err(red(error), error)
      }
    } catch (error) {
        err(red(error), error)
      response.sendStatus(500);
    }
  });
userRouter.post("/users/logoutall", authenticateUser, async (request, response) => {
    // The user is authenticated through the middleware so wipe the tokens array
    // We attached the user to the request object within authenticateUser
    try {
      request.user.tokens = [];
      await request.user.save();
        success(green("Successfully logged out of all sessions"))
        response.sendStatus(200);
    } catch (error) {
        err(red(error), error)
      response.status(500).send(error);
    }
});

// READ
userRouter.get("/users/myProfile", authenticateUser, (request, response) => {
  // User is authenticated and the user has been attached to the request object within authenticate user
    success(green("User Data"), request.user)
    response.send(request.user);
});

// UPDATE
userRouter.patch("/users/myProfile", authenticateUser, async (request, response) => {

    const updatedUser = request.user.validateUpdates(Object.keys(request.body), request, response)

    await updatedUser.save().then((user) => {
        try {
            success(green("Successfully updated user"))
        } catch (error) {
            err(red(error), error)
        }
    });
});

// DELETE

userRouter.delete("/users/myProfile", authenticateUser, async (request, response) => {
    try {
      await request.user.remove();
        success(green("Successfully deleted user"))
        sendEmail(request.user.email, request.user.name, "deleteUser");
        response.sendStatus(200);
    } catch (error) {
        err(red(error), error)
        response.sendStatus(500);
    }
  });

module.exports = userRouter;
