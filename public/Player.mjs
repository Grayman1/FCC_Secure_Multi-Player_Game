/*
// Import {canvas} from './game.mjs'
const canvas = {
  width: 640,
  height: 480
}


class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.lr = {};
    this.speed = 5;
    this.isColliding = false;
    this.isMain = main;
    this.direction = {};
  }

  // Drawing function
  draw(context, avObj, players, token) {
    const currDir = Object.keys(this.direction).filter(dir => this.direction[dir]);
    currDir.forEach(dir => this.movePlayer(dir, this.speed))

    if (this.isMain) {
      context.fillStyle = 'white';
    //  context.font = '20px "WizardFont"';
      context.textAlign = 'center';
      context.fillText(`${this.calculateRank(players)}`, canvas.width/2, 26);
    
      if (this.lr == 'left') {
        context.drawImage(avObj.av1Left, this.x, this.y, this.height, this.width)
      } else {
        context.drawImage(avObj.av1, this.x, this.y, this.height, this.width)
      }    
    } else {
      if (this.lr == 'left') {
        context.drawImage(avObj.av2Left, this.x, this.y, this.height, this.width)
      } else {
        context.drawImage(avObj.av2, this.x, this.y, this.height, this.width)
      }
    }
    if (this.collision(token)) {
      token.captured = this.id;

    }
  }
  playerMoving(direction) {
    this.direction[direction] = true;
  }
  playerStopped(direction) {
    this.direction[direction] = false;
  }



  movePlayer(direction, speed) {
    switch(direction){
      case 'right':
        this.x += speed;
        break;
      case 'left':
        this.x -= speed;
        break;
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
    }
  }

  collision(item) {

    return (item.x >= this.x || item.x <= this.x) &&  (item.y >= this.y || item.y <= this.y);
  }

  calculateRank(arr) {
    const sortedPlayers = arr.sort((a, b) => b.score - a.score);
    const index = sortedPlayers.findIndex(p => p.id === this.id);
    const rank = index + 1;
    return `Rank: ${rank}/${arr.length}`;
  }
}

export default Player;
*/

/*
const { canvasCalcs } = require("./game.mjs");
*/
const { canvasCalcs } = require("./canvas-data.mjs");


/*
import { canvasCalc } from "./canvas-data.jms";
*/

class Player {
  constructor({ x = 10, y = 10, w = 30, h = 30, score = 0, main, id }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 5;
    this.score = score;
    this.id = id;
    this.movementDirection = {};
    this.isMain = main;
  }

  draw(context, token, imgObj, activePlayers) {
    const currDir = Object.keys(this.movementDirection).filter(
      (dir) => this.movementDirection[dir]
    );
    currDir.forEach((dir) => this.movePlayer(dir, this.speed));

    if (this.isMain) {
      context.font = `13px 'Press Start'`;
      context.fillText(this.calculateRank(activePlayers), 560, 32.5);

      context.drawImage(imgObj.playerImg, this.x, this.y);
    } else {
      context.drawImage(imgObj.opponentImg, this.x, this.y);
    }

    if (this.collision(token)) {
      token.captured = this.id;
    }
  }

  moveDir(dir) {
    this.movementDirection[dir] = true;
  }

  stopDir(dir) {
    this.movementDirection[dir] = false;
  }

  movePlayer(dir, speed) {
    if (dir === "up")
      this.y - speed >= canvasCalcs.playFieldMinY
        ? (this.y -= speed)
        : (this.y -= 0);
    if (dir === "down")
      this.y + speed <= canvasCalcs.playFieldMaxY
        ? (this.y += speed)
        : (this.y += 0);
    if (dir === "left")
      this.x - speed >= canvasCalcs.playFieldMinX
        ? (this.x -= speed)
        : (this.x -= 0);
    if (dir === "right")
      this.x + speed <= canvasCalcs.playFieldMaxX
        ? (this.x += speed)
        : (this.x += 0);
  }

  collision(item) {
    if (
      this.x < item.x + item.w &&
      this.x + this.w > item.x &&
      this.y < item.y + item.h &&
      this.y + this.h > item.y
    )
      return true;
  }

  calculateRank(arr) {
    const sortedScore = arr.sort((a, b) => b.score - a.score);
    const mainPlayerRank =
      this.score === 0
        ? arr.length
        : sortedScore.findIndex((obj) => obj.id === this.id) + 1;
    return `Rank: ${mainPlayerRank}/${arr.length}`;
  }
}

export default Player;
