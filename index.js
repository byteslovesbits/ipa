const app = require("./app");

app.listen(3000, () => {
  console.log("Express is listening on port 3000");
});

app.get("/test", (request, response) => {
  response.send("/test");
});
