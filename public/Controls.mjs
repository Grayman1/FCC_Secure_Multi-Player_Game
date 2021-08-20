const controls = (player, socket) => {
  const getKey = (e) => {
    if (e.keyCode === 87 || e.keyCode === 38) return "up";
    if (e.keyCode === 83 || e.keyCode === 40) return "down";
    if (e.keyCode === 65 || e.keyCode === 37) return "left";
    if (e.keyCode === 68 || e.keyCode === 39) return "right";
    if (e.keyCode === 82 || e.keyCode === 114) return "R";
  };

  
  document.onkeydown = (e) => {
    let dir = getKey(e);
/*
    if (dir === 'R') {
      console.log('reset-request sent');
      socket.emit('reset-request');
    }
*/

    if (dir) {
      player.moveDir(dir);

      // Pass current player position back to the server
      socket.emit("move-player", dir, { x: player.x, y: player.y });
    }  
  };

/*
  document.onkeydown = (e) => {
    let dir = getKey(e); 

    if (dir) {
      player.moveDir(dir);

      // Pass current player position back to the server
      socket.emit("move-player", dir, { x: player.x, y: player.y });
    }    
  };
*/
  document.onkeyup = (e) => {
    let dir = getKey(e);

    if (dir) {
      player.stopDir(dir);

      // Pass current player position back to the server
      socket.emit("stop-player", dir, { x: player.x, y: player.y });
    }
  };
};

export default controls;