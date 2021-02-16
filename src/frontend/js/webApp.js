M.AutoInit();

class Model {
  constructor() {
    console.log("From Model");
  }

  createUser = async (user) => {
    const rawResponse = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    console.log(rawResponse);
    const content = await rawResponse.json();
    console.log(content);

    return content;
  };
}

class View {
  constructor() {
    console.log("From View");

    this.createUserForm = document.querySelector("#createUserForm");
  }

  bindCreateUser(handler) {
    this.createUserForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const user = {
        name: "",
        email: "",
        password: "",
      };

      event.preventDefault();

      let formData = new FormData(this.createUserForm);

      for (var [key, value] of formData.entries()) {
        user[key] = value;
      }

      // const result = await createUser(user);
      handler(user);
      // console.log(result);
    });
  }
}

class Controller {
  constructor(model, view) {
    console.log("From Controller");

    this.model = model;
    this.view = view;

    this.view.bindCreateUser(this.handleCreateUser);
  }

  handleCreateUser = (user) => {
    this.model.createUser(user);
  };
}

const app = new Controller(new Model(), new View());
