require("dotenv").config();
const express = require("express");
const expect = require("chai");
const socket = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");
const nocache = require("nocache");
const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

app.use(nocache());

app.use(helmet.noSniff());
app.use(helmet.xssFilter());
//app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);
/*
app.disable("x-powered-by");
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing


/*
require("dotenv").config();
const express = require("express");
const expect = require("chai");
const socket = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");
const nocache = require("nocache");
const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);
app.use(nocache());
app.disable("x-powered-by");
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
*/