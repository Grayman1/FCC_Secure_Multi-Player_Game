import { canvasCalcs } from "./canvas-data.mjs";

class Player {
  constructor({ x = 10, y = 10, w = 30, h = 30, score = 0, main, id }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 5;
    this.score = score;
    this.id = id;
    this.playerMoveDir = {};
    this.isMain = main;
  }

/*
  //context text-fill color chooser based on player
  const fillColor = (indx) => {
    if (indx.includes('1')) {
      return context.fillStyle = 'red';
    } else if (indx == 2) {
      return context.fillStyle = 'green';
    } else if (indx = 3) {
      return context.fillStyle = 'blue';
    } else if (indx == 4) {
      return context.fillStyle = 'magenta';
    } else { 
      return context.fillStyle = 'white';
    }
  }
*/

  draw(context, token, imgObj, activePlayers) {
    const currDir = Object.keys(this.playerMoveDir).filter(
      (dir) => this.playerMoveDir[dir]
    );
    currDir.forEach((dir) => this.movePlayer(dir, this.speed));

    if (this.isMain) {
    
    // Display Player Rank
    //  contxt.fillStyle = fillColor(this.id);
/*      context.fillStyle = 'white';
      context.font = `13px 'Press Start 2P'`;
      context.fillText(`Rank: `, 520, 32.5);
*/
      context.fillStyle = 'red';
      context.font = `13px 'Press Start 2P'`;
      context.fillText(this.calculateRank(activePlayers), 520, 32.5);

    // Display Player Score
    //  fillColor(id);
      context.fillStyle = 'white';
      context.font = `13px 'Press Start 2P'`;
      context.textAlign = "left";
      context.fillText(`Score: `, 49, 48);

      context.fillStyle = 'red';
      context.font = `13px 'Press Start 2P'`;
      context.textAlign = "left";
      context.fillText(`${this.score} `, 140, 48);
   
      //(this.calculateRank(activePlayers), 560, 32.5);
    console.log(`Score: ${this.score} `);

      context.drawImage(imgObj.playerImg, this.x, this.y)
   //   context.drawImage(imgObj.mainPlayerArt, this.x, this.y);
    } else {
      context.drawImage(imgObj.opponentImg, this.x, this.y);
  //    context.drawImage(imgObj.otherPlayerArt, this.x, this.y);
    }

    if (this.collision(token)) {
      token.captured = this.id;
    }
  }

  moveDir(dir) {
    this.playerMoveDir[dir] = true;
  }

  stopDir(dir) {
    this.playerMoveDir[dir] = false;
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
    const sortedScores = arr.sort((a, b) => b.score - a.score);
    const mainPlayerRank =
      this.score === 0
        ? arr.length
        : sortedScores.findIndex((obj) => obj.id === this.id) + 1;
//*    return `${mainPlayerRank}/${arr.length}`; */

    return `Rank: ${mainPlayerRank} / ${arr.length}`;
    
  }
}

export default Player;