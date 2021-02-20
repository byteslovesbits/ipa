const express = require("express");
const Job = require("../mongoose/models/jobModel");
const chalk = require("chalk");
const authenticateUser = require("../middleware/authenticateUser");
const {green, red, success,err} = require("../helpers/helpers")


const jobRouter = new express.Router();

jobRouter.post("/jobs", authenticateUser, async (request, response) => {
  const job = new Job({
    description: request.body.description,
    completed: request.body.completed,
      createdBy: request.user._id
  });

  try {
    await job.save();
      success(green("Successfully saved job"))
    response.status(201).send(job);
  } catch (error) {
      err(red("Could not save job"), error)
      response.status(400).send(error);
  }
});

module.exports = jobRouter;
