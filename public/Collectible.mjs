/*
class Collectible {
  constructor({x=10, y=10, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.width = 30;
    this.height = 30;
  }
  draw(context, tokenImage) {
    context.drawImage(tokenImage, this.x, this.y, this.height, this.width);
  }
}
*/
/*
  Note: Attempt to export this for use
  in server.js
*/

/*
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
*/


class Collectible {
  constructor({ x = 10, y = 10, w = 15, h = 15, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.id = id;
  }

/*
  draw(context, imgObj) {    
    context.drawImage(imgObj, this.x, this.y, this.w, this.h);   
  }
*/

  draw(context, imgObj) {
    if (this.value === 1) {
      context.drawImage(imgObj.bronzeCoinArt, this.x, this.y);
    } else if (this.value === 2) {
      context.drawImage(imgObj.silverCoinArt, this.x, this.y);
    } else {
      context.drawImage(imgObj.goldCoinArt, this.x, this.y);
    }
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/

try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;

