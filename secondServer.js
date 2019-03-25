var express = require("express");
var socket = require("socket.io");

var app = express();
var server = app.listen(8080);
app.get("/", function(req, res) {
  res.send("<b>My</b> second server");
});
var io = socket(server);
console.log("second server running");

io.sockets.on("connection", socket => {
  console.log("new connection of id:" + socket.id);
  socket.on("msg", msg => {
    console.log(msg);
  });
});
