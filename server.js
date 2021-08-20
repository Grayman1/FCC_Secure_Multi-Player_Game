require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const helmet = require("helmet");
const nocache = require("nocache");
const cors = require('cors');

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();

app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: {
      setTo: "PHP 7.4.3",
    }
  })
);

app.use(nocache());

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Socket.io setup:
// Start app and bind
// Socket.io to the same port
const io = socket(server);
const Collectible = require("./public/Collectible");
const { genStartPosition, canvasCalcs } = require("./public/canvas-data");

let activePlayers = [];
const capturedTokens = [];


// Generate Random New token
const createNewToken = () => {
  const rand = Math.random();
  let tokenValue;

  if (rand < 0.25) {
    tokenValue = 1;
  } else if (rand < 0.60) {
    tokenValue = 2;
  } else if (rand < 0.85) {
    tokenValue = 4;
  } else {
    tokenValue = 8;
  }

  return new Collectible({
    x: genStartPosition(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5
    ),
    y: genStartPosition(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5
    ),
    value: tokenValue,
    id: Date.now(),
  });
};



let token = createNewToken();


// on Connection, Expect main socket
io.sockets.on("connection", (socket) => {
  console.log(`New connection ${socket.id}`);

  // Emit init with socket id for client to create Player
  socket.emit("init", { id: socket.id, players: activePlayers, token });

  // Listen on Init, expect New Player
  socket.on("new-player", (obj) => {
    obj.id = socket.id;
    activePlayers.push(obj);
    socket.broadcast.emit("new-player", obj);
  });
  // Listen on Movement, expect Updated Player Info
  socket.on("move-player", (dir, obj) => {
    const movingPlayer = activePlayers.find((player) => player.id === socket.id);
    if (movingPlayer) {
      movingPlayer.x = obj.x;
      movingPlayer.y = obj.y;

      socket.broadcast.emit("move-player", {
        id: socket.id,
        dir,
        posObj: { x: movingPlayer.x, y: movingPlayer.y },
      });
    }
  });
  // Listen on Stop Movement, expect Updated Player Info
  socket.on("stop-player", (dir, obj) => {
    const stoppingPlayer = activePlayers.find(
      (player) => player.id === socket.id
    );
    if (stoppingPlayer) {
      stoppingPlayer.x = obj.x;
      stoppingPlayer.y = obj.y;

      socket.broadcast.emit("stop-player", {
        id: socket.id,
        dir,
        posObj: { x: stoppingPlayer.x, y: stoppingPlayer.y },
      });
    }
  });

  socket.on("capture-item", ({ playerId, tokenValue, tokenId }) => {
    if (!capturedTokens.includes(tokenId)) {
      const scoringPlayer = activePlayers.find((obj) => obj.id === playerId);
      const sock = io.sockets.connected[scoringPlayer.id];

      scoringPlayer.score += tokenValue;
      capturedTokens.push(tokenId);

      // Broadcast to all players when someone scores
      io.emit("update-player", scoringPlayer);

      // Communicate win state and broadcast losses
      // Set Max Score for Win
      if (scoringPlayer.score >= 20) {
        console.log("send 'end-game' from server.js");
        sock.emit("end-game", "win");
        sock.broadcast.emit("end-game", "lose");
      }

      // Generate new token and send it to all players
      token = createNewToken();
      io.emit("new-token", token);
    }
  });

  // Handle Game Reset Request
  socket.on('reset-request', (socket) => {
    console.log('reset-request sent');
    console.log("end-game-server.js:", endGame)
    if (!endGame == '') {
      endGame == '';

    // Reset Players
      activePlayers.forEach(obj => {
        if (Number.isInteger(obj.id)) {
        //  let startCoords = defaultPlayerStart(obj.id);
          obj.x = genStartPosition(
            canvasCalcs.playFieldMinX,
            canvasCalcs.playFieldMaxX,
            5
          );
          obj.y = genStartPosition(
            canvasCalcs.playFieldMinY,
            canvasCalcs.playFieldMaxY,
            5
          );
          obj.score = 0;
        }
      })
      // Send out New Game State Info
      io.emit('new-game', activePlayers)
    }
    else {
      console.log("Reset requested but game isn't over yet");
    }
  })

  // Listen on Player Disconnecting
  socket.on("disconnect", () => {
    socket.broadcast.emit("player-disconnect", socket.id);
    console.log(`${socket.id} Player disconnected`);

    // Remove Disconnected Player from Active Player array
    activePlayers = activePlayers.filter((player) => player.id !== socket.id);
  });
});

module.exports = app; // For testing