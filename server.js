var express = require("express");
var socket = require("socket.io");
var players = [];
var lasers = [];

function player(id, x, y, r, angle, nick) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.r = r;
  this.nick = nick;
  this.color = [randomNum(), randomNum(), randomNum()];
}

var app = express();
var server = app.listen(3000);
app.use(express.static("C:\Users\2TI\Desktop\Node.JS-p5-sockets-master\public\sketch"));
var io = socket(server);
console.log("Server is running...");

function send() {
  io.sockets.emit("get", players);
  for (var i = 0; i < lasers.length; i++) {
    lasers[i].x += lasers[i].velX;
    lasers[i].y += lasers[i].velY;

    if (offScreen(lasers[i])) {
      lasers.splice(i, 1);
    }
  }
  io.sockets.emit("getLasers", lasers);
}

setInterval(send, 33);

io.sockets.on("connection", socket => {
  console.log("New connection on id: " + socket.id);
  socket.on("start", data => {
    var p = new player(
      socket.id,
      data.x,
      data.y,
      data.r,
      data.angle,
      data.nick
    );
    players.push(p);
  });

  socket.on("update", data => {
    var p;
    for (var i = 0; i < players.length; i++) {
      if (socket.id === players[i].id) {
        p = players[i];
      }
    }

    p.x = data.x;
    p.y = data.y;
    p.angle = data.angle;
    p.nick = data.nick;
  });

  socket.on("addLaser", data => {
    lasers.push(data);
  });
});

function randomNum() {
  return Math.floor(Math.random() * 255 + 0);
}

function offScreen(laser) {
  return (
    laser.x > 600 + this.len ||
    laser.x < -20 ||
    laser.y > 600 + this.len ||
    laser.y < -20
  );
}

// Drugi server
// var io_second = require("socket.io-client");
// var socketSecond = io_second.connect("http://localhost:8080", {
//   reconnect: true
// });

// socketSecond.on("connect", () => {
//   console.log("connected to 4000");
// });

// socketSecond.emit("msg", "Hello from other server!");
