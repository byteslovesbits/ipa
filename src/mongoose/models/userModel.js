const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error(
          "ValidatorError: Password is too weak! Consider adding some capital letters, special characters and numbers to increase your security..."
        );
      }
    },
  },
  // This array of json web tokens will serve to authenticate a user with multiple device logins
  jsonWebTokens: [
    {
      jwt: {
        type: String,
        required: true,
      },
    },
  ],
});

/*INSTANCE METHODS
Each Schema can define instance and static methods for its model.*/
userSchema.methods.makeJWT = async function () {
  /*create a JSON web token to authenticate the user-agent. To guarantee a unique payload we can use the unique _id that
  mongoose generates for user documents and save having to generate a random payload.*/
  const jsonWebToken = await jwt.sign(
    { _id: this._id },
    "6WCM0029-0105-2020-Computer-Science-Project(COM)",
    {
      expiresIn: "1d",
    }
  );

  // Create a new array with the json web token attached to the jsonWebTokens array and save
  this.jsonWebTokens = this.jsonWebTokens.concat({
    jwt: jsonWebToken,
  });

  await this.save();
  return jsonWebToken;
};

// MODELS
// An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.

const User = mongoose.model("User", userSchema);

module.exports = User;
