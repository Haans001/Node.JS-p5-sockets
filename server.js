var express = require("express");
var socket = require("socket.io");
var player;
var players = [];
var lasers = [];
var width = 1920;
var height = 1000;

function player(id, x, y, r, angle, nick) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.r = r;
  this.nick = nick;
  this.color = [randomNum(), randomNum(), randomNum()];
}

var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port);
app.use(express.static("public/sketch"));
var io = socket(server);
console.log("Server is running...");
console.log(server.address().address);

function send() {
  io.sockets.emit("get", players);
  io.sockets.emit("getLasers", lasers);
}

setInterval(send, 20);

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
    var l = {
      id: socket.id,
      playerLasers: []
    };
    lasers.push(l);
    players.push(p);
  });

  socket.on("update", data => {
    if (players.length == 0) return;
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

  socket.on("updateLasers", data => {
    for (var i = 0; i < lasers.length; i++) {
      if (lasers[i].id === socket.id) {
        lasers[i].playerLasers = data;
      }
    }
  });
  socket.on("disconnect", function() {
    for (var i = 0; i < players.length; i++) {
      if (players[i].id == socket.id) {
        players.splice(i, 1);
      }
    }
  });
});
function randomNum() {
  return Math.floor(Math.random() * 255 + 0);
}
