const express = require("express");
const Job = require("../mongoose/models/jobModel");
const authenticateUser = require("../middleware/authenticateUser");
const {_200, _201,_400,_404, _500} = require("../helpers/helpers")

const jobRouter = new express.Router();

// CREATE
jobRouter.post("/jobs", authenticateUser, async (request, response) => {
  const job = new Job({
    description: request.body.description,
    finished: request.body.finished,
      createdBy: request.user._id,
      notes: request.body.notes
  });

  try {
    await job.save();
    _201("Successfully saved job")
    response.status(201).send(job);
  } catch (error) {
      _400(error)
      response.status(400).send(error);
  }
});

// READ
jobRouter.get('/jobs/:id', authenticateUser, async (request,response)=>{

    try {
        // Once authenticated I can get the job with the :id I provided but only if it was created by me
        const job = await Job.findOne({_id: request.params.id, createdBy: request.user._id})
        if(!job){
            _404()
            return response.sendStatus(404)
        }
        _201(job)
        response.send(job)
    }catch(error){
        _500(error)
        response.sendStatus(500)
    }
})

jobRouter.get('/jobs', authenticateUser, async (request,response)=>{
try{
    const jobs = await Job.find({createdBy: request.user._id})
    _200(jobs)
    response.send(jobs)
}catch(error){
    _500(error)
    response.sendStatus(500)
}
})

jobRouter.patch('/jobs/:id', authenticateUser, async (request, response) =>{


    const permittedUpdates = ['finished', 'description', 'notes']
    const isValidUpdate = Object.keys(request.body).every((update) => permittedUpdates.includes(update))


    if(!isValidUpdate){
        _400('Invalid Update Attempted')
        return response.sendStatus(400)
    }

    try{
        const job = await Job.findOne({_id: request.params.id, createdBy: request.user._id})

        if(!job){
            _404('No Job Found')
            return response.sendStatus(404)
        }
        Object.keys(request.body).forEach((update)=>{
            job[update] = request.body[update]
        })
        await job.save()
        _201('Job saved')
        response.sendStatus(200)


    }catch(error){
        _400(error)
        response.sendStatus(400)
    }

})

jobRouter.delete('/jobs/:id', authenticateUser, async (request,response)=>{
    try{
        const job = await Job.findOne({_id: request.params.id, createdBy: request.user.createdBy})
        if(!job){
            _404('No Job Found')
            response.sendStatus(404)
        }
    }catch(error){
        _500(error)
        response.sendStatus(500)
    }
})



module.exports = jobRouter;
