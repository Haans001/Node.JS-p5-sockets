var express = require("express");
var socket = require("socket.io");

var app = express();
var server = app.listen(4000);

var io = socket(server);

console.log("second server running");

io.sockets.on("connection", socket => {
  socket.on("msg", () => {
    socket.emit("msg", "Hello from second server!");
  });
});
