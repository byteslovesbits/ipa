const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const Job = require("../models/jobModel")
const {_500} = require("../../helpers/helpers")


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

// MIDDLEWARE
userSchema.pre("save", async function (next) {
  this.isModified("password")
    ? (this.password = await bcrypt.hash(this.password, 10))
    : next();
});

userSchema.pre('remove', async function (next){
    await Job.deleteMany({createdBy: this._id})
    next()
})

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

  // Attach a json web token to to the tokens array on the user document
  this.tokens = this.tokens.concat({
    token: jsonWebToken,
  });

  try {
    await this.save();
    return jsonWebToken;
  } catch (error) {
      _500(error)
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


    } catch (error) {
        console.log(chalk.black.bgRed("Could not apply updates"));
        console.log(error)
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
    throw new Error("Login Failed. Please Authenticate!");
  }

  return user;
};

// MODELS
// An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.
const User = mongoose.model("User", userSchema);

module.exports = User;
