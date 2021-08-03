/*
//import Player from './Player.mjs';
//import Collectible from './Collectible.mjs';

//const io=socket(server);
const {Player} = require('./Player.mjs');
const {Collectible} = require('./Collectible.mjs');

const socket = io();
console.log('game.mjs io:' + io);
console.log('game.mjs socket:' + socket);
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


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

const startPosition = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
};

// Image Loading Function
const loadImg = (src) => {
  const tempImg = new Image();
  tempImg.src=src;
  return tempImg;
}

// Images to Load

//const bone1 = loadImg('./img/bone1.png')
const red_gem = loadImg('./img/red_gem.png')
const blue_gem = loadImg('./img/blue_gem.png')
const green_gem = loadImg('./img/green_gem.png')
const diamond_gem = loadImg('./img/diamond.png')
//const bone2 = loadImg('./img/bone2.png')
//const ship1 = loadImg('./img/ship1.png')
//const ship2 = loadImg('./img/ship2.png')
const playerImg = loadImg('./img/player.png')
const opponentImg = loadImg('./img/opponent.png')
const plyrColors = ['Red', 'Blue', 'Yellow', 'Green']




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


let activePlayers = [];
let tick;
let frameId;
let token;
let gameOver;



// DECLARE GAME STATES

// Initialize Game

socket.on('init', ({id, players, initToken}) => {
  console.log('Connected as: ', id);
  cancelAnimationFrame(frameId);

  const mainPlayer = new Player({

    x:startPosition(canvasCalcs.playFieldMinX, canvasCalcs.playFieldMaxX, 5),
    y:startPosition(canvasCalcs.playFieldMinY, canvasCalcs.playFieldMaxY, 5),
    id,
    main: true
  });

  motionControl(mainPlayer, socket);
  socket.emit('new-player', mainPlayer);
  socket.on('new-player', playerObj => {
    const playersId = activePlayers.map(player => player.id);
    if(!playersId.includes(playerObj.id)) {
      activePlayers.push(new Player(playerObj));
    }
  });

  // Move Player
  socket.on('move-player', ({id, dir, posObj}) => {
    const movingPlayer = activePlayers.find(player => player.id === id);
    movingPlayer.moveDir(dir);

  // Force Sync if Lag Occurs
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
    movingPlayer.lr = posObj.lr;
  });

  // Stop Player
  socket.on('stop-player', ({id, dir, posObj }) => {
    const stoppingPlayer = activePlayers.find(player => player.id === id);
    stoppingPlayer.stopDir(dir);

    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
    stoppingPlayer.lr = posObj.lr;
  });

  // Create New Collectible token
  socket.on('new-token', newToken => {
    token = new Collectible(newToken);
  });

  // Player Disconnects  From Game
  socket.on('player-disconnect', id => {
    console.log(`${id} disconnected`);
    activePlayers = activePlayers.filter(player => player.id !== id);
  })

  // Update when Game gameOver
  socket.on('game-over', winLose => {
    gameOver = winLose;
  });

  // Update score when Player Scores
  socket.on('player-scored', playerObject => {
    const scoringPlayer = activePlayers.find(player => player.id === playerObject.id);
    scoringPlayer.score = playerObject.score;
  });

  activePlayers = players.map(val => new Player(val)).concat(mainPlayer);
  token = new Collectible(initToken);

  animateCanvas();
})

const animateCanvas = () => {
  canvas.style.letterSpacing = 6 + 'px';
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // draw rank infobar
  context.fillStyle = '#00000085';
  context.fillRect(0, 0, canvas.width, 40);

  //draw controls infobar
  context.fillStyle = '#00000085';
  context.fillRect(0, canvas.height - 60, canvas.width, 60);

  // draw control infobar title
  context.fillStyle = 'white';
  context.font = `13px "Press Start"`;
  context.textAlign = 'center';

  context.fillText('CONTROLS:WASD', canvas.width / 2, canvas.height - 38);

  // draw underline of infobar title
  context.beginPath();
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.moveTo((canvas.width / 2) - 62, canvas.height - 32);
  context.lineTo((canvas.width / 2) + 56, canvas.height - 32);
  context.stroke();

  // draw control infobar text
  context.fillStyle = 'white';
//  context.font = '16px "WizardFont"';
  context.textAlign = 'center';
  context.fillText('W = UP | S = DOWN | A = LEFT | D = RIGHT', canvas.width / 2, canvas.height - 12);

  activePlayers.forEach(player => {
    player.draw(context, { red_gem, blue_gem, green_gem, diamond_gem }, activePlayers, token);
  });

  // Draw Current Token
  token.draw(context, {red_gem, blue_gem, green_gem, diamond_gem});

  // Remove Captured Coin
  if (token.captured) {
    socket.emit('token-captured', {
      playerId: token.captured,
      tokenValue: token.value,
      tokenId: token.id
    })
  }

  if (gameOver) {
    context.fillStyle = 'white';
    context.font = `13px "Press Start"`;
    context.fillText(`You ${gameOver}! Refresh screen to play again.`, canvasCalcs.canvasWidth / 2, 180);
  }

  if (!gameOver) {
    frameId = requestAnimationFrame(animateCanvas);
  }
}

export {
  startPosition,
  canvasCalcs
}
*/

const {Player} = require("./Player.mjs");
const {Collectible} = require("./Collectible.mjs");
//const {controls} = require("./controls.mjs");
//const { generateStartPos, canvasCalcs } = require("./canvas-data.mjs");
//const { CanvasCalc } = require("./canvas-data.mjs");



/*
import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import controls from "./Controls";
import { generateStartProps } from "./canvas-data.mjs";
import { CanvasCalc } from "./canvas-data.mjs";
*/


const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

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




//preload
const loadImage = (src) => {
  const img = new Image();
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
const mainPlayerArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/main-player.png"
);
const otherPlayerArt = loadImage(
  "https://cdn.freecodecamp.org/demo-projects/images/other-player.png"
);

let tick;
let currPlayers = [];
let item;
let endGame;

socket.on("init", ({ id, players, coin }) => {
  console.log("Connected as", id);
  cancelAnimationFrame(tick);
  const mainPlayer = new Player({
    x: generateStartProps(
      CanvasCalc.playFieldMinX,
      CanvasCalc.playFieldMaxX,
      5
    ),
    y: generateStartProps(
      CanvasCalc.playFieldMinY,
      CanvasCalc.playFieldMaxY,
      5
    ),
    id,
    main: true,
  });
  controls(mainPlayer, socket);
  socket.emit("new-player", mainPlayer);
  socket.on("new-player", (obj) => {
    const playersId = currPlayers.map((player) => player.id);
    if (!playersId.includes(obj.id)) currPlayers.push(new Player(obj));
  });
  socket.on("move-player", ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find((obj) => obj.id === id);
    movingPlayer.moveDir(dir);

    //Force sync in case of lag
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });
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
  socket.on("end-game", (result) => (endGame = result));
  socket.on("update-player", (playerObj) => {
    const scoring = currPlayers.find((obj) => obj.id === playerObj.id);
    scoring.score = playerObj.score;
  });
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
