M.AutoInit();
//w$alX()x!£mk014c3550

class Model {
    constructor() {
    }

    async createUser(user){

        const rawResponse = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        await rawResponse.json().then((data) =>{
            this.onUserCreatedChanged(data)
        });
    }
    async loginUser(user){
        const rawResponse = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user),
        });

        await rawResponse.json().then((data) =>{
            this.onLoginUserChanged(data)
        });
    }
    async logoutUser(user){
        const rawResponse = await fetch("http://localhost:3000/users/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user),
        });

        // const rawResponse = await fetch("http://localhost:3000/users/logout", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${localStorage.getItem('token')}`
        //     }
        //     // body: JSON.stringify(user),
        // });

        await rawResponse.json().then((data) =>{
            this.onLogoutUserChanged(data)
        });
    }
    async logoutUserAllSessions(user){
        const rawResponse = await fetch("http://localhost:3000/users/logoutall", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user),
        });

        await rawResponse.json().then((data) =>{
            this.onLogoutUserAllSessionsChanged(data)
        });
    }
    async getMyProfile(user){
        const rawResponse = await fetch("http://localhost:3000/users/myprofile", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user),
        });

        await rawResponse.json().then((data) =>{
            this.onGetMyProfileChanged(data)
        });
    }
    async getUsers(user){
        const rawResponse = await fetch("http://localhost:3000/users", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user),
        });

        await rawResponse.json().then((data) =>{
            this.onGetUsersChanged(data)
        });
    }
    async createJob(job){

        const rawResponse = await fetch("http://localhost:3000/jobs", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(job),
        });

        await rawResponse.json().then((data) =>{
            this.onJobCreatedChanged(data)
        });
    }
    async getUserById(id){
        const rawResponse = await fetch(`http://localhost:3000/users/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });

        await rawResponse.json().then((data) =>{
            this.onGetUserByIdChanged(data)
        });
    }
    async getJobById(id){
        const rawResponse = await fetch(`http://localhost:3000/jobs/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });

        await rawResponse.json().then((data) =>{
            this.onGetJobByIdChanged(data)
        });
    }

    async getJobs(jobs){
        const rawResponse = await fetch("http://localhost:3000/jobs", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        await rawResponse.json().then((data) =>{
            this.onGetJobsChanged(data)
        });
    }







    // BINDERS
    bindUserCreatedChanged(callback) {
        this.onUserCreatedChanged = callback
    }
    bindLoginUserChanged(callback) {
        this.onLoginUserChanged = callback
    }
    bindLogoutUserChanged(callback) {
        this.onLogoutUserChanged = callback
    }
    bindLogoutUserAllSessionsChanged(callback) {
        this.onLogoutUserAllSessionsChanged = callback
    }
    bindGetMyProfileChanged(callback) {
        this.onGetMyProfileChanged = callback
    }
    bindGetUsersChanged(callback) {
        this.onGetUsersChanged = callback
    }
    bindGetUserByIdChanged(callback) {
        this.onGetUserByIdChanged = callback
    }
    bindJobCreatedChanged(callback) {
        this.onJobCreatedChanged = callback
    }
    bindGetJobByIdChanged(callback) {
        this.onGetJobByIdChanged = callback
    }
    bindGetJobsChanged(callback) {
        this.onGetJobsChanged = callback
    }


}

class View{
    constructor() {
        this.createUserForm = document.querySelector("#createUserForm");
        this.loginUserForm = document.querySelector("#loginUserForm");
        this.logoutButton = document.querySelector("#logoutButton");
        this.logoutAllUserSessionsButton = document.querySelector("#logoutAllUserSessionsButton");
        this.getMyProfileButton = document.querySelector("#getMyProfileButton");
        this.getUsersButton = document.querySelector("#getUsersButton");
        this.getUserByIdButton = document.querySelector("#getUserByIdButton");
        this.getJobByIdButton = document.querySelector("#getJobByIdButton");
        this.createJobForm = document.querySelector("#createJobForm");
        this.getJobById = document.querySelector("#getJobById")
        this.getAllJobsButton = document.querySelector('#getAllJobsButton')
        this.userId = document.querySelector('#userId')
    }

    // BINDERS
    bindCreateUser(handler) {
        this.createUserForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // The FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest.
            let formData = new FormData(this.createUserForm);

            const user = {
                name: "",
                email: "",
                password: "",
            };

            for (var [key, value] of formData.entries()) {
                user[key] = value;
            }
            handler(user);
        });
    }
    bindLoginUser(handler) {
        this.loginUserForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // The FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest.
            let formData = new FormData(this.loginUserForm);

            const user = {
                email: "",
                password: "",
            };

            for (var [key, value] of formData.entries()) {
                if(key === 'emailLogin'){
                    user.email = value

                }
                else{
                    user.password = value
                }
            }
            handler(user);
        });
    }
    bindLogoutUser(handler) {
        this.logoutButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler();
        });
    }
    bindLogoutUserAllSessions(handler) {
        this.logoutAllUserSessionsButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler();
        });
    }
    bindGetMyProfile(handler) {
        this.getMyProfileButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler();
        });
    }
    bindGetUsers(handler) {
        this.getUsersButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler();
        });
    }
    bindGetUserById(handler) {
        this.getUserByIdButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler(this.userId.value);
        });
    }
    bindCreateJob(handler) {
        this.createJobForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // The FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest.
            let formData = new FormData(this.createJobForm);

            const job = {
                description: "",
                finished: "",
            };

            for (var [key, value] of formData.entries()) {
                job[key] = value;
            }
            handler(job);
        });
    }
    bindGetJobById(handler) {
        this.getJobByIdButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler(this.getJobById.value);
        });
    }
    bindGetJobs(handler) {
        this.getAllJobsButton.addEventListener("click", async (event) => {
            event.preventDefault();
            handler();
        });
    }





    // UPDATE VIEWS
    updateView = (user) =>{

        if(user.token){
            localStorage.setItem('token', user.token)
            console.log('Successfully Created User', user)
            M.toast({html: 'Successfully Created User', displayLength: 2500, activationPercent: 0.5, classes: 'green'})
        }
        else{
            console.log('Failed to Create User')
            M.toast({html: 'Failed to Create User!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }
    updateLoginView = (user) =>{

        if(user.token){
            localStorage.setItem('token', user.token);
            console.log('Successfully Logged In...')
            M.toast({html: 'Successfully Logged In...', displayLength: 2500, activationPercent: 0.5, classes: 'green'})
        }
        else{
            console.log('Login Failed. Please Authenticate!')
            M.toast({html: 'Login Failed. Please Authenticate!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }

    updateLogoutView = (user) =>{
        if(user.error){
            console.log('Please Authenticate')
            M.toast({html: 'Please Authenticate!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
        else{
            console.log('Successfully logged out')
            M.toast({html: 'Successfully Logged Out...', displayLength: 2500, activationPercent: 0.5, classes: 'green'})
        }
    }
    updateLogoutAllUserSessionsView = (user) =>{
        if(user.error){
            console.log('Please Authenticate')
            M.toast({html: 'Please Authenticate!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})

        }
        else{
            console.log('Successfully Logged Out of all Sessions')
            M.toast({html: 'Successfully Logged Out of all Sessions', displayLength: 2500, activationPercent: 0.5, classes: 'green'})
        }
    }
    updateGetMyProfileView = (user) =>{

        if(user._id){
            // localStorage.setItem('token', user.token);
            M.toast({html: JSON.stringify(user), displayLength: 10000, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Could not get users!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }

    updateGetUsersView = (users) =>{
        if(users[0]){
            // localStorage.setItem('token', user.token);
            M.toast({html: JSON.stringify(users), displayLength: 5000, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Could not get user profile!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }
    updateGetUserByIdView = (user) =>{
        if(user._id){
            M.toast({html: JSON.stringify(user), displayLength: 5000, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Could not get user!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }
    updateCreateJobView = (job) =>{
        if(job._id){
            // localStorage.setItem('token', user.token);
            M.toast({html: 'Created job...', displayLength: 2500, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Failed to create job...', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }
    updateGetJobByIdView = (job) =>{
        if(job._id){
            M.toast({html: JSON.stringify(job), displayLength: 5000, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Could not get user!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }
    updateGetJobsView = (jobs) =>{
        console.log('Hi there')
        if(jobs[0]){
            M.toast({html: JSON.stringify(jobs), displayLength: 5000, activationPercent: 0.5, classes: 'green'})
        }
        else{
            M.toast({html: 'Could not get jobs!', displayLength: 2500, activationPercent: 0.5, classes: 'red'})
        }
    }




}

class Controller{

    constructor(model, view) {
        this.model = model
        this.view = view

        // BINDERS
        this.model.bindUserCreatedChanged(this.onCreateUserChanged)
        this.view.bindCreateUser(this.handleCreateUser)

        this.model.bindLoginUserChanged(this.onLoginUserChanged)
        this.view.bindLoginUser(this.handleLoginUser)

        this.model.bindLogoutUserChanged(this.onLogoutUserChanged)
        this.view.bindLogoutUser(this.handleLogoutUser)

        this.model.bindLogoutUserAllSessionsChanged(this.onLogoutUserAllSessionsChanged)
        this.view.bindLogoutUserAllSessions(this.handleLogoutAllUserSessions)

        this.model.bindGetMyProfileChanged(this.onGetMyProfileChanged)
        this.view.bindGetMyProfile(this.handleGetMyProfile)

        this.model.bindGetUsersChanged(this.onGetUsersChanged)
        this.view.bindGetUsers(this.handleGetUsers)

        this.model.bindGetUserByIdChanged(this.onGetUserByIdChanged)
        this.view.bindGetUserById(this.handleGetUserById)

        this.model.bindJobCreatedChanged(this.onJobCreatedChanged)
        this.view.bindCreateJob(this.handleCreateJob)

        this.model.bindGetJobByIdChanged(this.onGetJobByIdChanged)
        this.view.bindGetJobById(this.handleGetJobById)

        this.model.bindGetJobsChanged(this.onGetJobsChanged)
        this.view.bindGetJobs(this.handleGetJobs)
    }

    // HANDLERS
    handleCreateUser = (user) => {
        this.model.createUser(user)
    }
    handleLoginUser = (user) => {
        this.model.loginUser(user)
    }
    handleLogoutUser = (user) => {
        this.model.logoutUser(user)
    }
    handleLogoutAllUserSessions = (user) => {
        this.model.logoutUserAllSessions(user)
    }
    handleGetMyProfile = (user) => {
        this.model.getMyProfile(user)
    }
    handleGetUsers = (user) => {
        this.model.getUsers(user)
    }
    handleGetUserById = (id) =>{
        this.model.getUserById(id)
    }
    handleGetJobById = (id) =>{
        this.model.getJobById(id)
    }
    handleGetJobs = (jobs) => {
        this.model.getJobs(jobs)
    }



    handleCreateJob = (job) => {
        this.model.createJob(job)
    }


    // ONCHANGE
    onCreateUserChanged = (user)=>{
        this.view.updateView(user)
    }
    onLoginUserChanged = (user)=>{
        this.view.updateLoginView(user)
    }
    onLogoutUserChanged = (user)=>{
        this.view.updateLogoutView(user)
    }
    onLogoutUserAllSessionsChanged = (user)=>{
        this.view.updateLogoutAllUserSessionsView(user)
    }
    onGetMyProfileChanged = (user)=>{
        this.view.updateGetMyProfileView(user)
    }
    onGetUsersChanged = (user)=>{
        this.view.updateGetUsersView(user)
    }
    onGetUserByIdChanged = (user)=>{
        this.view.updateGetUserByIdView(user)
    }
    onJobCreatedChanged = (job)=>{
        this.view.updateCreateJobView(job)
    }
    onGetJobByIdChanged = (user)=>{
        this.view.updateGetJobByIdView(user)
    }
    onGetJobsChanged = (job)=>{
        this.view.updateGetJobsView(job)
    }



}
const app = new Controller(new Model(), new View())
