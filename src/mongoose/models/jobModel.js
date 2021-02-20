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
    // It makes sense for new jobs to have a completed value default to false
    completed: {
      type: Boolean,
      default: false,
    },
      createdBy:{
        type: mongoose.Schema.Types.ObjectId
      }
  },
  {
    timestamps: { createdAt: "created@", updatedAt: "updated@" },
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
