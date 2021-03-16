const express = require("express");
const Job = require("../mongoose/models/jobModel");
const authenticateUser = require("../middleware/authenticateUser");
const {_200, _201,_400,_404, _500} = require("../helpers/helpers")

const jobRouter = new express.Router();

// CREATE
jobRouter.post("/jobs", authenticateUser, async (request, response) => {
  const job = new Job({
    description: request.body.description,
    finished: request.body.finished === 'on'? true: false,
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
            return response.status(404).send({})
        }
        _201(job)
        response.send(job)
    }catch(error){
        _500(error)
        response.sendStatus(500)
    }
})
jobRouter.get('/jobs', authenticateUser, async (request,response)=>{



    const finished = request.query.finished


    const limit = request.query.limit ? parseInt(request.query.limit) : 3
    const skip = request.query.skip ? parseInt(request.query.skip) : 2
    const sortBy = request.query.sortBy

    if(finished){
        const jobs = await Job.find({createdBy: request.user._id, finished: finished}).limit(limit).skip(skip).sort({createdAt: 1})
        return response.send(jobs)
    }

    if(sortBy){

        const sortByWhat = sortBy.split(':')[0]
        const value = sortBy.split(':')[1] === 'asc' ? 1: -1

        if(sortByWhat === 'createdAt'){
            const jobs = await Job.find({createdBy: request.user._id}).sort({createdAt: value})
            return response.send(jobs)
        }
    }


try{
    const jobs = await Job.find({createdBy: request.user._id})
    _200(jobs)
    response.send(jobs)
}catch(error){
    _500(error)
    response.sendStatus(500)
}
})

// UPDATE
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
jobRouter.patch('/jobs', authenticateUser, async (request, response) =>{
    // TODO
})


// DELETE
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
jobRouter.delete('/jobs', authenticateUser, async (request,response)=>{
    try{
        const job = await Job.deleteMany({})
        if(job.n === 0){
            return response.status(404).send({error: 'No jobs to delete'})
        }
        _200('All jobs deleted')
        response.send({success: 'All jobs deleted'})
    }catch(error){
        response.send({failure: error})
        console.log(error)
    }
})


module.exports = jobRouter;

/*openapi: 3.0.0
servers:
    - description: SwaggerHub API Auto Mocking
url: https://virtserver.swaggerhub.com/Hertfordshire-Uni/bsc/1.0.0
    info:
        description: Final Year Project
version: "1.0.0"
title: Users and Jobs API
contact:
    email: marcakirk@gmail.com
license:
name: Apache 2.0
url: 'http://www.apache.org/licenses/LICENSE-2.0.html'

paths:
    /users:
post:
    tags:
        - CREATE (users)
summary: create user
description: create a user within the database
responses:
    '201':
description: user created
'400':
description: bad request
'500':
description: internal server error
requestBody:
    content:
        application/json:
schema:
    $ref: '#/components/schemas/user'
get:
    tags:
        - READ (users)
summary: get list of users
description: This resource represents a list of all the users currently stored within the database. Each user is identified with a _id property of type ObjectId
responses:
    '200':
description: 'OK - users'
content:
    application/json:
schema:
    type: array
items:
    $ref: '#/components/schemas/users'
'400':
description: bad input parameter
patch:
    tags:
        - PATCH (users)
summary: bulk update users
description: update all users within the database
responses:
    '201':
description: users updated
'400':
description: bad request
delete:
tags:
    - DELETE (users)
summary: delete all users
description: this resource deletes all users from the database
responses:
    '200':
description: users deleted
'400':
description: bad request

/users/login:
post:
    tags:
        - CREATE (users)
summary: Login a user.
    description: This resource logs in a user through json web token authentication
responses:
    '200':
description: successfully logged in
content:
application/json:
schema:
    $ref: '#/components/schemas/user'
'400':
description: Bad request - unauthorized
requestBody:
    content:
        application/json:
schema:
    $ref: '#/components/schemas/token'
externalDocs:
    description: Learn more about user operations provided by this API.
    url: http://somerandomurl/learnmore
    /users/logout:
    post:
        tags:
            - CREATE (users)
summary: logout a user
description: This resource logs out a user but they must first be authenticated using json web tokens
responses:
    '200':
description: successfully logged out
'400':
description: bad request unauthorized
'500':
description: internal server error
requestBody:
    content:
        application/json:
schema:
    $ref: '#/components/schemas/token'
    /users/logoutall:
post:
    tags:
        - CREATE (users)
summary: logs a user out of all sessions
description: This resource logs out a user out of all sessions and wipes the tokens array
responses:
    '200':
description: successfully logged out of all sessions
'400':
description: bad request unauthorized
'500':
description: internal server error
requestBody:
    content:
        application/json:
schema:
    $ref: '#/components/schemas/token'
    /users/{id}:
get:
    tags:
        - READ (users)
summary: Gets user by id.
    description: This resource represents a user currently stored within the database. Each user is identified with a _id property of type ObjectId
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '200':
description: user found
content:
    application/json:
schema:
    $ref: '#/components/schemas/user'
'404':
description: No user found
externalDocs:
    description: Learn more about user operations provided by this API.
    url: http://somerandomurl/learnmore
    patch:
        tags:
            - PATCH (users)
summary: update user by id
description: update the details of a user with id within the database
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '201':
description: user updated
'400':
description: bad request
delete:
tags:
    - DELETE (users)
summary: delete user
description: this resource deletes a user from the database
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '200':
description: users deleted
'400':
description: bad request

/users/myprofile:
get:
    tags:
        - READ (users)
summary: Get my profile
description: This resource represents a user currently stored within the database. Each user is identified with a _id property of type ObjectId
responses:
    '200':
description: user found
content:
    application/json:
schema:
    $ref: '#/components/schemas/user'
'404':
description: No user found
externalDocs:
    description: Learn more about user operations provided by this API.
    url: http://somerandomurl/learnmore
    patch:
        tags:
            - PATCH (users)
summary: update my profile
description: update all details of my profile
responses:
    '201':
description: profile updated
'400':
description: bad request

/jobs:
get:
    tags:
        - READ (jobs)
summary: get list of jobs
description: This resource represents all jobs you created currently stored within the database. Each job is identified with a _id property of type ObjectId. You cannot retrieve other peoples jobs.
    responses:
'200':
description: job found
content:
    application/json:
schema:
    $ref: '#/components/schemas/job'
'404':
description: No job found
externalDocs:
    description: Learn more about user operations provided by this API.
    url: http://somerandomurl/learnmore
    post:
        tags:
            - CREATE (jobs)
summary: create a job
description: create a user in the database
responses:
    '201':
description: user created
'400':
description: bad request
'500':
description: internal server error
requestBody:
    content:
        application/json:
schema:
    $ref: '#/components/schemas/job'
patch:
    tags:
        - PATCH (jobs)
summary: bulk update jobs
description: update all jobs within the database
responses:
    '201':
description: jobs updated
'400':
description: bad request
delete:
tags:
    - DELETE (jobs)
summary: delete all jobs
description: this resource deletes all jobs from the database
responses:
    '200':
description: jobs deleted
'400':
description: bad request

/jobs/{id}:
get:
    tags:
        - READ (jobs)
summary: get job by id
description: This resource represents a job currently stored within the database. Each job is identified with a _id property of type ObjectId
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '200':
description: job found
content:
    application/json:
schema:
    $ref: '#/components/schemas/job'
'404':
description: No job found
externalDocs:
    description: Learn more about user operations provided by this API.
    url: http://somerandomurl/learnmore
    delete:
tags:
    - DELETE (jobs)
summary: delete user
description: this resource deletes a user from the database
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '200':
description: users deleted
'400':
description: bad request
patch:
    tags:
        - PATCH (jobs)
summary: update job by id
description: update the details of a job with id within the database
parameters:
    - name: id
in: path
description: _id of type ObjectId
required: true
schema:
    type: string
responses:
    '201':
description: user updated
'400':
description: bad request


components:
    schemas:
        users:
            type: object
properties:
    id:
        type: string
format: uuid
example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
name:
    type: string
example: 'Marc Kirk'
email:
    type: string
example: 'marcakir@gmail.com'
token:
    properties:
        token:
            type: string
example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDMyNjk2N2QyMzk1OTM2ZmNiYTg3ZTUiLCJpYXQiOjE2MTM5MTY1MTksImV4cCI6MTYxNDAwMjkxOX0.Vyn3NrMjJOWCrApzRNEHkaU90W3AgyQOZ_KEQJRQGeg'
user:
    type: object
properties:
    id:
        type: string
format: uuid
example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
name:
    type: string
example: 'Marc Kirk'
email:
    type: string
example: 'marcakir@gmail.com'
token:
    type: object
properties:
    token:
        type: object
example: {"token": "jwt"}
job:
    type: object
properties:
    id:
        type: string
example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
description:
    type: string
example: 'Complete final year project'
finished:
    type: boolean
example: true*/


