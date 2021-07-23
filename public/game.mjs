import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

socket.on('connect', () => {
  console.log('connected to server')
})

// Image Loading Function
const loadImg = (src) => {
  const tempImg = new Image();
  tempImg.src=src;
  return tempImg;
}

// Images to Loading

const bone1 = loadImg('./img/bone1.png')
const green_gem = loadImg('./img/green_gem.png')
const bone2 = loadImg('./img/bone2.png')
const ship1 = loadImg('./img/ship1.png')
const ship2 = loadImg('./img/ship2.png')
const player = loadImg('./img/player.png')
const opponent = loadImg('./img/opponent.png')
const plyrColors = ['Red', 'Blue', 'Yellow', 'Green']



// Controls Functions
const controls = (player, socket) => {
  const getKey = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) return "up";
    if (e.keyCode === 83 || e.keyCode === 40) return "down";
    if (e.keyCode === 65 || e.keyCode === 37) return "left";
    if (e.keyCode === 68 || e.keyCode === 39) return "right";
  };

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


//  Canvas Settings
const canvasWidth = 640;
const canvasHeight = 480;
const playerWidth = 30;
const playerHeight = 30;
const border = 5; // Between edge of canvas and play field
const infoBar = 45;

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


