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

const io = socket(server);
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`)
})

module.exports = app; // For testing
