require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const helmet = require('helmet')

const noCache = require('nocache')

app.use(noCache())


app.use(helmet.noSniff())
app.use(helmet.xssFilter())
/*
app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);
*/
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));


//app.use(helmet.noCache())


/*

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.set('x-powered-by', 'PHP 7.4.3');
    res.sendFile(process.cwd() + '/views/index.html');
  }); 
*/

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

// Initial Game Set-Up
let activePlayers = [];
let caughtCoins = ];
const {startPosition, canvasCalcs} = requre('./public/game')


// Collectible Functions
const Collectible = require('./public/Collectible')
create newToken = () = {
  return new Collectible({
    x: startPosition(canvasCalcs.fieldMinX, canvasCalcs.fieldMaxX, 5),
    yx: startPosition(canvasCalcs.fieldMinY, canvasCalcs.fieldMaxY, 5),
    value: 1, 
    id: Date.now()
  })

}
let initToken = create newToken();

// Init Game Server Set-Up


// Socket Set-Up
const io = socket(server);

// On Connection, Expect Socket
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)
  socket.emit('init', {id: socket.id, players: activePlayers, initToken})


// Emit Init With Socket ID for Client for Create Player
  socket.on('new-player', playerObj => {
    playerObj.id = socket.id;
    activePlayers.push(playerObj);
    socket.broadcast.emit('new-player', playerObj)
  });

  // Move Player
  socket.on('move-player', (keyPressed, playerObj) => {
    const movingPlayer = activePlayers.find(player => player.id === socket.id);
    if (movingPlayer) {
    movingPlayer.x = playerObj.x;
    movingPlayer.y = playerObj.y;
    movingPlayer.lr = playerObj.lr;
    socket.broadcast.emit('move-player', {keyPressed, movingPlayer});
    }
  });

  // Stop Player Motion
  socket.on('stop-player', (keyReleased, playerObj ) => {
    const stoppedPlayer = activePlayers.find(player => player.id === socket.id);
    if (stoppedPlayer) {
      stoppedPlayer.x = playerObj.x;
      stoppedPlayer.y = playerObj.y;
      stoppedPlayer.lr = playerObj.lr;
      socket.broadcast.emit('stop-player', {keyReleased, stoppedPlayer});
    }
  });

  // Player disconnects from Game
  socket.on('disconnect', () => {
    socket.broadcast.emit('player-disconnect', socket.id);
    activePlayers = activePlayers.filter(player => player.id === socket.id)
  });


  // When Token Captured  
  socket.on('token-caught', (token) => {
    if (!caughtTokens.includes(token.id) {
      const scoringPlayer = activePlayers.find(player => player.id === token.caught);
      if (scoringPlayer) {
        const scoringPlayerSocket = io.sockets.connected[scoringPlayer.id];

        caughtTokens.push(token.id);
        scoringPlayer.score += token.value;
        io.emit('player-scored', scoringPlayer);

        if(scoringPlayer.score)
       }


    })

  })

})

module.exports = app; // For testing
