const mongoose = require("mongoose");
const validator = require("validator");

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
});

// MODELS
// An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.

const User = mongoose.model("User", userSchema);

module.exports = User;
