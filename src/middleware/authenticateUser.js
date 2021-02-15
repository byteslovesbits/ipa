const jwt = require("jsonwebtoken");
const User = require("../mongoose/models/userModel");
const chalk = require("chalk");

const authenticateUser = async (request, response, next) => {
  try {
    const decoded = decodeJWT(request.header("Authorization"));

    // Find a user within the database. The mongoose _id was submitted as the payload when makeJWT ran
    // We can get this _id from the decoded json web token and use that to filter a search for a user within the database
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": request.header("Authorization").replace("Bearer ", ""),
    });

    if (!user) {
      throw new Error();
    }
    // Attach the token and user to the request for later use so that the end-point has access to these values without
    // having to query the database a second time
    request.token = request.header("Authorization").replace("Bearer ", "");
    request.user = user;

    next();
  } catch (e) {
    console.log(chalk.black.bgRed("error: Please authenticate..."));
    response.status(401).send({ error: "Please authenticate." });
  }
};

const decodeJWT = (requestHeader) => {
  // Grab the Authorization header value and strip the token from it. Decode the token to authenticate the user-agent
  return jwt.verify(
    requestHeader.replace("Bearer ", ""),
    "6WCM0029-0105-2020-Computer-Science-Project(COM)"
  );
};

module.exports = authenticateUser;
