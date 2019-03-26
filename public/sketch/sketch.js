let p;
let bg = [];
var socket;
var players = [];
var lasers = [];
var input, button;
var nick = " ";

function setup() {
  createCanvas(1920, 1000);
  // uruchomienie socket wysyłającego na port 3000
  socket = io.connect("http://localhost:3000");

  // Gwiazdki <3
  for (let i = 0; i < 300; i++) {
    let x = random(-width, width * 3);
    let y = random(-height, height * 3);
    let w = random(1, 3);
    let a = map(w, 0.5, 3, 50, 255);
    bg[i] = new Background(x, y, a, w);
  }
  // inicjalizacja gracza
  p = new Player(width / 2, height / 2, 32, socket);

  // Stworzenie obiektu gracz i dodanie go do pamięci serwera
  var data = {
    x: p.pos.x,
    y: p.pos.y,
    angle: p.angle,
    r: p.r,
    nick: nick
  };

  socket.emit("start", data);

  // aktuzalizaja stanu wszystkich graczy
  socket.on("get", function(data) {
    players = data;
  });
  // aktualizacja laserow na mapie
  socket.on("getLasers", function(data) {
    lasers = data;
  });
}

function draw() {
  if (p.pos.x < 0) {
    if (p.pos.y < 0) translate(width / 2, height / 2);
    else translate(width / 2, height / 2 - p.pos.y);
  } else if (p.pos.y < 0) translate(width / 2 - p.pos.x, height / 2);
  else translate(width / 2 - p.pos.x, height / 2 - p.pos.y);
  background(0);
  // Gwiazdki <3
  bg.forEach(bg => {
    bg.display();
  });
  // Poruszanie i rysowanie gracza
  p.run(nick);

  // Rysowanie reszty graczy
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === socket.id) continue;
    newDrawing(players[i]);
  }
  // Rysowanie wszystkich laserow
  for (var i = 0; i < lasers.length; i++) {
    drawLaser(lasers[i]);
  }
  // Wyeksportowanie jedynie stanu lokalnego gracza x,y, kąt, nick
  exportPlayerState();
}

function newDrawing(player) {
  push();
  strokeWeight(1);
  text(player.nick, player.x - 15, player.y - 30);
  translate(player.x, player.y);
  rotate(player.angle);
  stroke(220, 0, 200);
  fill(player.color[0], player.color[1], player.color[2]);
  strokeWeight(2);
  triangle(
    -(player.r / 2),
    player.r / 2,
    player.r / 2,
    player.r / 2,
    0,
    (-player.r * 2) / 3
  );
  pop();
}

function drawLaser(laser) {
  push();
  translate(laser.x, laser.y);
  rotate(laser.angle - PI / 2);
  stroke(232, 41, 44);
  strokeWeight(3);
  line(0, 0, 20, 0);
  pop();
}

function exportPlayerState() {
  var data = {
    x: p.pos.x,
    y: p.pos.y,
    angle: p.angle,
    nick: nick
  };
  socket.emit("update", data);
}

function keyPressed() {
  if (key == " ") {
    var vel = p5.Vector.fromAngle(p.angle - PI / 2).mult(40);
    var newLaser = {
      id: socket.id,
      velX: vel.x,
      velY: vel.y,
      x: p.pos.x,
      y: p.pos.y,
      angle: p.angle
    };

    socket.emit("addLaser", newLaser);
  }
}

var input = document.getElementById("input");
var submit = document.getElementById("submit");
var form = document.getElementById("form");

submit.addEventListener("click", function() {
  nick = input.value;
  form.style.opacity = 0;
});
