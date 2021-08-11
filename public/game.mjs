/*import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import generateStartPos from './canvas-data.mjs';
import canvasCalcs from './canvas-data.mjs';
import motionControl from './Controls.mjs';
*/

/*
const {Player} = require("./Player.mjs");
const {Collectible} = require("./Collectible.mjs");
*/

/*
const socket=io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

console.log(canvas.width, canvas.height);
*/
/*
//  Canvas Settings
const canvasWidth = 640;
const canvasHeight = 480;
const playerWidth = 30;
const playerHeight = 30;
const border = 5; // Between edge of canvas and play field
const infoBar = 45;

// Embed canvasCalcs object
const canvasCalcs = {
  canvasWidth: canvasWidth,
  canvasHeight: canvasHeight,
  playFieldMinX: canvasWidth / 2 - (canvasWidth - 10) / 2,
  playFieldMinY: canvasHeight / 2 - (canvasHeight - 100) / 2,
  playFieldWidth: canvasWidth - border * 2,
  playFieldHeight: canvasHeight - infoBar - border * 2,
  playFieldMaxX: canvasWidth - playerWidth - border,
  playFieldMaxY: canvasHeight - playerHeight - border,
};

const generateStartPos = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
};
*/
/*
// Controls Functions
const motionControl = (player, socket) => {
  const getKey = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) return "up";
    if (e.keyCode === 83 || e.keyCode === 40) return "down";
    if (e.keyCode === 65 || e.keyCode === 37) return "left";
    if (e.keyCode === 68 || e.keyCode === 39) return "right";
    }
  

  document.onkeydown = (e) => {
    let dir = getKey(e);

    if (dir) {
      player.moveDir(dir);

      // Pass current player position back to the server
      socket.emit("move-player", dir, { x: player.x, y: player.y });
    }
  };

  document.onkeyup = (e) => {
    let dir = getKey(e);

    if (dir) {
      player.stopDir(dir);

      // Pass current player position back to the server
      socket.emit("stop-player", dir, { x: player.x, y: player.y });
    }
  };
};
*/

/*
// Pre-Load Token, Player Images
const loadImage = (src) => {
  const img = new Image();
  img.src = src;
  return img;
};                                 

const red_gem = loadImage('./img/red_gem.png');
const blue_gem = loadImage('./img/blue_gem.png');
const green_gem = loadImage('./img/green_gem.png');
const diamond = loadImage('./img/diamond.png');
const playerImg = loadImage('./img/player.png');
const opponentImg = loadImage('./img/opponent.png');
*/

/*
const bronzeCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png"
);
const silverCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png"
);
const goldCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png"
);
const playerImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/main-player.png"
);
const opponentImg = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/other-player.png"
);
*/

/*
let frameId;
let currPlayers = [];
let item;
let endGame;
*/

/*
const createCoin = () => {
  const rand = Math.random();
  let coinValue;

  if(rand <0.25) {
    coinValue = 1;
  } else if (rand < 0.5) {
    coinValue= 2;
  } else if (rand < 0.75) {
    coinValue = 3;
  } else {
    coinValue = 4;
  }

  return new Collectible({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playfieldMaxX,
      5
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playfieldMaxY,
      5
    ),
    value: coinValue,
    id: Date.now(),

  })
}
*/

/*
socket.on("init", ({ id, players, coin }) => {
  
  console.log(`Connected ${id}`);
//  console.log("Connected as", id);

  // Cancel animation if one already exists
  cancelAnimationFrame(frameId);  
  
  const mainPlayer = new Player({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5
    ),
    id,
    main: true,
  });

  motionControl(mainPlayer, socket);

  socket.emit("new-player", mainPlayer);

  socket.on("new-player", (obj) => {
    const playersId = currPlayers.map((player) => player.id);
    if (!playersId.includes(obj.id)) currPlayers.push(new Player(obj));
  });

  // Handle Player Moves
  socket.on("move-player", ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find((obj) => obj.id === id);
    movingPlayer.moveDir(dir);

    //Force sync in case of lag
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });
  // Handle Player stop motion
  socket.on("stop-player", ({ id, dir, posObj }) => {
    const stoppingPlayer = currPlayers.find((obj) => obj.id === id);
    stoppingPlayer.stopDir(dir);
    //In case of lag
    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  socket.on("new-coin", (newCoin) => {
    item = new Collectible(newCoin);
  });

  socket.on("remove-player", (id) => {
    console.log(`${id} disconnected`);
    currPlayers = currPlayers.filter((player) => player.id !== id);
  });

  // Handle end game state
  socket.on("end-game", (result) => (endGame = result));

  // Handle Player Scoring
  socket.on("update-player", (playerObj) => {
    const scoringPlayer = currPlayers.find((obj) => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  });

  // Populate List of Connected Players and
  // Create Current Coin when Logging In
  currPlayers = players.map((val) => new Player(val)).concat(mainPlayer);
  item = new Collectible(coin);

  draw();
});

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set background color
  context.fillStyle = "#220";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create border for play field
  context.strokeStyle = "white";
  context.strokeRect(
    canvasCalcs.playFieldMinX,
    canvasCalcs.playFieldMinY,
    canvasCalcs.playFieldWidth,
    canvasCalcs.playFieldHeight
  );

  // Controls text
  context.fillStyle = "white";
  context.font = `13px 'Press Start 2P'`;
  context.textAlign = "center";
  context.fillText("Controls: WASD", 100, 32.5);

  // Game title
  context.font = `16px 'Press Start 2P'`;
  context.fillText("Coin Race", canvasCalcs.canvasWidth / 2, 32.5);

  // Calculate score and draw players each frame
  currPlayers.forEach((player) => {
    player.draw(context, item, { playerImg, opponentImg }, currPlayers);
  });

  // Draw current coin
  item.draw(context, { red_gem, blue_gem, green_gem, diamond });

  // Remove destroyed coin
  if (item.destroyed) {
    socket.emit("destroy-item", {
      playerId: item.destroyed,
      coinValue: item.value,
      coinId: item.id,
    });
  }

  if (endGame) {
    context.fillStyle = "white";
    context.font = `13px 'Press Start 2P'`;
    context.fillText(
      `You ${endGame}! Restart and try again.`,
      canvasCalcs.canvasWidth / 2,
      80
    );
  }

  if (!endGame) frameId = requestAnimationFrame(draw);
};
*/


import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import controls from "./Controls.mjs";
import { generateStartPos, canvasCalcs } from "./canvas-data.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d", { alpha: false });

// Preload game assets
const loadImage = (src) => {
  let img = new Image();
  img.src = src;
  return img;
};

const bronzeCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/bronze-coin.png"
);
const silverCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/silver-coin.png"
);
const goldCoinArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/gold-coin.png"
);

const mainPlayerArt = loadImage('./public/img/ship1.png');
/*
const mainPlayerArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/main-player.png"
); */
const otherPlayerArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/other-player.png"
);

//const playerImg = loadImage('./img/player.png');
//const opponentImg = loadImage('../img/opponent.png');

let tick;
let currPlayers = [];
let item;
let endGame;

socket.on("init", ({ id, players, coin }) => {
  console.log(`Connected ${id}`);

  // Cancel animation if one already exists and
  // the page isn't refreshed, like if the server
  // restarts
  cancelAnimationFrame(tick);

  // Create our player when we log on
  const mainPlayer = new Player({
    x: generateStartPos(
      canvasCalcs.playFieldMinX,
      canvasCalcs.playFieldMaxX,
      5
    ),
    y: generateStartPos(
      canvasCalcs.playFieldMinY,
      canvasCalcs.playFieldMaxY,
      5
    ),
    id,
    main: true,
  });

  controls(mainPlayer, socket);

  // Send our player back to the server
  socket.emit("new-player", mainPlayer);

  // Add new player when someone logs on
  socket.on("new-player", (obj) => {
    // Check that player doesn't already exist
    const playerIds = currPlayers.map((player) => player.id);
    if (!playerIds.includes(obj.id)) currPlayers.push(new Player(obj));
  });

  // Handle movement
  socket.on("move-player", ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find((obj) => obj.id === id);
    movingPlayer.moveDir(dir);

    // Force sync in case of lag
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });

  socket.on("stop-player", ({ id, dir, posObj }) => {
    const stoppingPlayer = currPlayers.find((obj) => obj.id === id);
    stoppingPlayer.stopDir(dir);

    // Force sync in case of lag
    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  // Handle new coin gen
  socket.on("new-coin", (newCoin) => {
    item = new Collectible(newCoin);
  });

  // Handle player disconnection
  socket.on("remove-player", (id) => {
    console.log(`${id} disconnected`);
    currPlayers = currPlayers.filter((player) => player.id !== id);
  });

  // Handle endGame state
  socket.on("end-game", (result) => (endGame = result));

  // Update scoring player's score
  socket.on("update-player", (playerObj) => {
    const scoringPlayer = currPlayers.find((obj) => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  });

  // Populate list of connected players and
  // create current coin when logging in
  currPlayers = players.map((val) => new Player(val)).concat(mainPlayer);
  item = new Collectible(coin);

  draw();
});

const draw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set background color
  context.fillStyle = "#220";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create border for play field
  context.strokeStyle = "white";
  context.strokeRect(
    canvasCalcs.playFieldMinX,
    canvasCalcs.playFieldMinY,
    canvasCalcs.playFieldWidth,
    canvasCalcs.playFieldHeight
  );

  // Controls text
  context.fillStyle = "white";
  context.font = `13px 'Press Start 2P'`;
  context.textAlign = "center";
  context.fillText("Controls: WASD", 100, 32.5);

  // Game title
  context.font = `16px 'Press Start 2P'`;
  context.fillText("Coin Race", canvasCalcs.canvasWidth / 2, 32.5);

  // Calculate score and draw players each frame
  currPlayers.forEach((player) => {
    player.draw(context, item, { mainPlayerArt, otherPlayerArt }, currPlayers);
  //  player.draw(context, item, { mainPlayerArt, otherPlayerArt }, currPlayers);
  });

  // Draw current coin
  item.draw(context, { bronzeCoinArt, silverCoinArt, goldCoinArt });

  // Remove destroyed coin
  if (item.destroyed) {
    socket.emit("destroy-item", {
      playerId: item.destroyed,
      coinValue: item.value,
      coinId: item.id,
    });
  }

  if (endGame) {
    context.fillStyle = "white";
    context.font = `13px 'Press Start 2P'`;
    context.fillText(
      `You ${endGame}! Restart and try again.`,
      canvasCalcs.canvasWidth / 2,
      80
    );
  }

  if (!endGame) tick = requestAnimationFrame(draw);
};
