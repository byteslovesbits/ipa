const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/ipa", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((r) => {
    console.log("mongodb connected...");
  })
  .catch((error) => {
    console.log("Error:", error);
  });
