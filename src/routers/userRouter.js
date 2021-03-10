const express = require("express");
const User = require("../mongoose/models/userModel");
const authenticateUser = require("../middleware/authenticateUser");
const sendEmail = require("../sendgrid/sendgrid");
const {_200, _201, _400,_404, _500} = require("../helpers/helpers")

const userRouter = new express.Router();

// CREATE
userRouter.post("/users", async (request, response) => {
  try {
    // Incoming json body data  to create user
    const user = new User(request.body);

    const token = await user.makeJWT();

    await user.save().then((user) => {

      try {
          // Lockdown what is returned to the user-agent. Do not allow an attacker to have
          // access to the tokens array data or the hashed user password!
          const User = user.toObject()
          delete User.password
          delete User.tokens

          _201('User Saved to database')
          response.set({"uri": '/users'})
          response.set({'token': token })
          response.status(201).send({ User, token: token });
          sendEmail(user.email, user.name, "signup");
      } catch (error) {
          _500(error)
      }
    });

  } catch (error) {
    _400(error)
    response.status(400).send(error);
  }
});
userRouter.post("/users/login", async (request, response) => {
  try {
    const user = await User.findUser(request.body.email, request.body.password);
    _200("Successfully logged in user")
    response.send({ user, token: await user.makeJWT() });
  } catch (error) {
      _400(error)
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
      _200("Successfully logged out user", request.user)
        // response.sendStatus(200);
          response.send(request.user)

      } catch (error) {
          _400(error)
      }
    } catch (error) {
        _500(error)
      response.sendStatus(500);
    }
  });
userRouter.post("/users/logoutall", authenticateUser, async (request, response) => {
    // The user is authenticated through the middleware so wipe the tokens array
    // We attached the user to the request object within authenticateUser
    try {
      request.user.tokens = [];
      await request.user.save();
        _200('Successfully logged out of all sessions')
        response.send(request.user);
    } catch (error) {
        _500(error)
      response.status(500).send(error);
    }
});

// READ
userRouter.get("/users/myprofile", authenticateUser, (request, response) => {
  // User is authenticated and the user has been attached to the request object within authenticate user
    _200("User Data", request.user)
    response.send(request.user);
});
userRouter.get("/users", authenticateUser, async (request,response)=>{
    const users = await User.find({})

    try{
        if(!users){
            return response.sendStatus(404)
            throw new Error('No users found')
        }

    }catch(error){
        _404('No users found', error)
    }
    response.send(users)
})
userRouter.get("/users/:id", async (request,response)=>{
    try{

        const user = await User.findById(request.params.id)
        if(!user){
            return response.status(404).send('No user found')
        }
        response.send(user)
    }catch(error){
        response.send(error)
    }
})

// UPDATE
userRouter.patch("/users/myProfile", authenticateUser, async (request, response) => {

    const updatedUser = request.user.validateUpdates(Object.keys(request.body), request, response)

    await updatedUser.save().then((user) => {
        try {
            _200("Successfully updated user")
        } catch (error) {
            _500(error)
        }
    });
});
userRouter.patch("/users", authenticateUser, async (request, response) => {
    // TODO
});


// DELETE
userRouter.delete("/users/myProfile", authenticateUser, async (request, response) => {
    try {
      await request.user.remove();
      _200("Successfully deleted user")
        response.sendStatus(200);

        sendEmail(request.user.email, request.user.name, "deleteUser");
    } catch (error) {
        _500(error)
        response.sendStatus(500);
    }
  });
userRouter.delete("/users", authenticateUser, async (request, response) => {
    // TODO
});



module.exports = userRouter;


