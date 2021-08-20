import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import controls from "./Controls.mjs";
import { genStartPosition, canvasCalcs } from "./canvas-data.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d", { alpha: false });

// Image Pre-Load Function
const loadImage = (src) => {
  let img = new Image();
  img.src = src;
  return img;
};

// Images to Load
const red_gem = loadImage('./public/img/red_gem.png');
const blue_gem = loadImage('./public/img/blue_gem.png');
const green_gem = loadImage('./public/img/green_gem.png');
const diamond = loadImage('./public/img/diamond.png');
const playerImg = loadImage('./public/img/ship1.png');
const opponentImg = loadImage('./public/img/ship4.png');


// Game States
let gameTick; // Animation time
let activePlayers = []; // Client's Player Object
let currentGame = [];
let item;
let endGame;

socket.on("init", ({ id, players, token }) => {
  console.log(`Connected ${id}`);

  // Cancel animation if one already exists and
  // the page isn't refreshed, like if the server
  // restarts
  cancelAnimationFrame(gameTick);

  // Create our player when we log on
  const mainPlayer = new Player({
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
    id,
    main: true,
  });

  controls(mainPlayer, socket);

  // Send our player back to the server
  socket.emit("new-player", mainPlayer);

  // Add new player when someone logs on
  socket.on("new-player", (obj) => {
    // Check that player doesn't already exist
    const playerIds = activePlayers.map((player) => player.id);
    if (!playerIds.includes(obj.id)) activePlayers.push(new Player(obj));
  });

  // Handle movement
  socket.on("move-player", ({ id, dir, posObj }) => {
    const movingPlayer = activePlayers.find((obj) => obj.id === id);
    movingPlayer.moveDir(dir);

    // Force sync in case of lag
    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });

  socket.on("stop-player", ({ id, dir, posObj }) => {
    const stoppingPlayer = activePlayers.find((obj) => obj.id === id);
    stoppingPlayer.stopDir(dir);

    // Force sync in case of lag
    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  // Handle new token gen
  socket.on("new-token", (newToken) => {
    item = new Collectible(newToken);
  });

  // Handle player disconnection
  socket.on("player-disconnect", (id) => {
    console.log(`Player on: ${id} disconnected`);
    activePlayers = activePlayers.filter((player) => player.id !== id);
  });

  // Handle endGame state
  socket.on("end-game", (result) => {
    console.log("end-game-game.mjs:",endGame);
    endGame = result;
  });

  // Update scoring player's score
  socket.on("update-player", (playerObj) => {
    const scoringPlayer = activePlayers.find((obj) => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  });

  // Populate list of connected players and
  // create current token when logging in
  activePlayers = players.map((val) => new Player(val)).concat(mainPlayer);
  item = new Collectible(token);

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
  context.fillText("Controls: WASD", 100, 25);

  // Game title
  context.font = `16px 'Press Start 2P'`;
  context.fillText("Coin Race", canvasCalcs.canvasWidth / 2, 32.5);


  // Calculate score and draw players each frame
  activePlayers.forEach((player) => {
    player.draw(context, item, { playerImg, opponentImg }, activePlayers);
  //  player.draw(context, item, { mainPlayerArt, otherPlayerArt }, activePlayers);
  });


  // Draw current token
  item.draw(context, { red_gem, blue_gem, green_gem, diamond });
//  item.draw(context, { bronzeCoinArt, silverCoinArt, goldCoinArt });

  // Remove captured token
  if (item.captured) {
    socket.emit("capture-item", {
      playerId: item.captured,
      tokenValue: item.value,
      tokenId: item.id,
    });
  }

  if (endGame) {
    context.fillStyle = "white";
    context.font = `22px 'Press Start 2P'`;
    context.textAlign = "center";
    context.fillText(
      `You ${endGame}!`,
      canvasCalcs.canvasWidth / 2,
      150
    );
    context.fillStyle = "magenta";
    context.font = `16px 'Press Start 2P'`;
    context.fillText(
      `Refresh Screen to Re-Start and`,
      canvasCalcs.canvasWidth / 2,
      190
    );
    context.fillText(
      `Try Again!`,
      canvasCalcs.canvasWidth / 2,
      220
    );
  }

  if (!endGame) gameTick = requestAnimationFrame(draw);
};
