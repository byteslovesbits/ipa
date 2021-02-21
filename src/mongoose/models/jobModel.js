const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 100,
      required: true,
      unique: true,
    },
      notes:{
          type: String,
          maxlength: 1000,
          trim: true,
      },
    // It makes sense for new jobs to have a completed value default to false
    finished: {
      type: Boolean,
      default: false,
    },
      createdBy:{
        type: mongoose.Schema.Types.ObjectId,
          required: true,
          // The ref option is what tells Mongoose which model to use during population.
          // Here we reference documents within the User collection
          ref: 'User'

      }

  },
  {
    timestamps: { createdAt: "created@", updatedAt: "updated@" },
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
