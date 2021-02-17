const express = require("express");
const Job = require("../mongoose/models/jobModel");
const chalk = require("chalk");
const authenticateUser = require("../middleware/authenticateUser");

const jobRouter = new express.Router();

jobRouter.post("/jobs", authenticateUser, async (request, response) => {
  const job = new Job({
    description: request.body.description,
    completed: request.body.completed,
    // TODO Jobs need owners
  });

  try {
    await job.save();
    console.log(chalk.black.bgGreen("Successfully saved job"));
    response.status(201).send(job);
  } catch (error) {
    console.log(chalk.black.bgRed("Could not save job"));
    console.log(error);
    response.status(400).send(error);
  }
});

module.exports = jobRouter;
