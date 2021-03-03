const supertest = require("supertest")
const app = require("../../app")
const User = require("../../src/mongoose/models/userModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

// USERS
const MarcKirkId = new mongoose.Types.ObjectId()
const MercedesKirkId = new mongoose.Types.ObjectId()
const MarcKirk = {
    _id: MarcKirkId,
    name: "Marc Kirk",
    email: "marcakirk@gmail.com",
    password: "w$alX()x!£mk014c3550",
    tokens: [
        {
            token: jwt.sign({_id: MarcKirkId}, '6WCM0029-0105-2020-Computer-Science-Project(COM)')
        }
    ]
}
const MercedesKirk = {
    _id: MercedesKirkId,
    name: "Mercedes Kirk",
    email: "mercedeskirk@gmail.com",
    password: "w$alX()x!£mk014c3550",
    tokens: [
        {
            token: jwt.sign({_id: MercedesKirkId}, '6WCM0029-0105-2020-Computer-Science-Project(COM)' )
        }
    ]


}

// Start with freshly seeded data
beforeEach(async ()=> {
    await User.deleteMany()
    await new User(MarcKirk).save()
})

afterAll(async ()=> {
    await User.deleteMany()
})



test('Create MercedesKirk', async ()=>{
    const response = await supertest(app).post('/users').send(MercedesKirk).expect(201)

    // Check the Database includes the new user
    const user = await User.findById(response.body.User._id)
    expect(user).not.toBeNull()


})

test('Login MarcKirk', async ()=>{
    const response1 = await supertest(app).post('/users/login').send({email: "marcakirk@gmail.com", password: "w$alX()x!£mk014c3550"}).expect(200)
})

test('Do not login MarcKirk with incorrect password', async()=>{
    const response = await supertest(app).post('/users/login').send({email: "marcakirk@gmail.com", password: "badpassword"}).expect(400)
})

test('Do not login a user that does not exist', async()=>{
    const response = await supertest(app).post('/users/login').send({email: "invalid@invalid.com", password: "w$alX()x!£mk014c355"}).expect(400)
})

test('Get profile for MarcKirk', async()=>{
    const response = await supertest(app).get('/users/myprofile').set('Authorization', `Bearer ${MarcKirk.tokens[0].token}`).send().expect(200)
})

test('Do not get profile for MarcKirk', async()=>{
    const response = await supertest(app).get('/users/myprofile').set('Authorization', 'Thisisanincorrecttoken').send().expect(401)
})

test('Delete MarcKirk', async()=>{
    const response = await supertest(app).delete('/users/myprofile').set('Authorization', `Bearer ${MarcKirk.tokens[0].token}`).send().expect(200)
})

test('Do not delete MarcKirk with bad data', async()=>{
    const response = await supertest(app).delete('/users/myprofile').set('Authorization', `Bearer invalidtokenhere`).send().expect(401)
})






