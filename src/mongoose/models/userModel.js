const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const chalk = require("chalk");

// SCHEMA - A mongoose schema defines and maps documents to a mongodb collection.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,

    // mongoose provides validation but for more complex validation, custom validators are required
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(
          "ValidationError: Email address has an incorrect format!"
        );
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error(
          "ValidatorError: Password is too weak! Consider adding some capital letters, special characters and numbers to increase your security..."
        );
      }
    },
  },
  // This array of json web tokens will serve to authenticate a user with multiple device logins
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  this.isModified("password")
    ? (this.password = await bcrypt.hash(this.password, 10))
    : next();
});

/*INSTANCE METHODS
Each Schema can define instance and static methods for its model.*/
userSchema.methods.makeJWT = async function () {
  /*create a JSON web token to authenticate the user-agent. To guarantee a unique payload we can use the unique _id that
  mongoose generates for user documents and save having to generate a random payload.*/
  const jsonWebToken = await jwt.sign(
    { _id: this._id.toString() },
    "6WCM0029-0105-2020-Computer-Science-Project(COM)",
    {
      expiresIn: "1d",
    }
  );

  // Create a new array with the json web token attached to the jsonWebTokens array and save
  this.tokens = this.tokens.concat({
    token: jsonWebToken,
  });

  try {
    await this.save();
    return jsonWebToken;
  } catch (error) {
    console.log(chalk.black.bgRed(error), error);
  }
};

userSchema.methods.validateUpdates = function (updates, request, response){

    const requestedUpdates = updates
    const permittedUpdates = ["email", "password", "name"];

    const isValidUpdate = requestedUpdates.every((update) => permittedUpdates.includes(update));

    if (!isValidUpdate) {
        throw new Error("Invalid updates");
    }


    try {
        requestedUpdates.forEach((update) => (request.user[update] = request.body[update]));
        response.status(201).send(request.user);
        console.log(chalk.black.bgGreen("Updates applied successfully"));

    } catch (error) {
        console.log(chalk.black.bgRed("Could not apply updates"));
        console.log(error)
        response.status(400).send(error);
    }


    return request.user

}

// STATICS
userSchema.statics.findUser = async (email, password) => {
  // First establish if the user actually exists in the database
  const user = await User.findOne({ email: email });

  // If there is no user move on
  if (!user) {
    throw new Error("Unable to login");
  }

  const isUserPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isUserPasswordCorrect) {
    throw new Error("Unable to login");
  }

  return user;
};

// MODELS
// An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
const User = mongoose.model("User", userSchema);

module.exports = User;
