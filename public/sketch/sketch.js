let p;
let bg = [];
var socket;
var players = [];
var input, button;
var otherLasers = [];
var nick = " ";

function setup() {
  createCanvas(1920, 1000);
  // uruchomienie socket wysyłającego na adres
  socket = io.connect("https://safe-bayou-67525.herokuapp.com/");

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

  // aktuzalizaja stanu wszystkich graczyheroku o
  socket.on("get", function(data) {
    players = data;
  });
  // aktualizacja laserow na mapie
  socket.on("getLasers", function(data) {
    otherLasers = data;
  });
}

function draw() {
  //  if (p.pos.x < 0) {
  //    if (p.pos.y < 0) translate(width / 2, height / 2);
  //    else translate(width / 2, height / 2 - p.pos.y);
  //  } else if (p.pos.y < 0) translate(width / 2 - p.pos.x, height / 2);
  translate(width / 2 - p.pos.x, height / 2 - p.pos.y);
  background(0);

  //rysowanie brzegów
  noFill();
  stroke(255);
  // console.log(width * 4 + "||" + height * 4 + "||||||" + p.pos);
  rect(-width, -height, width * 4, height * 4);

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
  // Rysowanie moich laserow
  for (var i = 0; i < p.lasers.length; i++) {
    p.lasers[i].update();
    p.lasers[i].show();
    if (p.lasers[i].offScreen()) {
      p.lasers.splice(i, 1);
    }
  }

  for (var i = 0; i < otherLasers.length; i++) {
    if (otherLasers[i].id == socket.id) continue;
    var playerLasers = otherLasers[i].playerLasers;
    for (var j = 0; j < playerLasers.length; j++) {
      push();
      translate(playerLasers[j].x, playerLasers[j].y);
      rotate(playerLasers[j].angle);
      stroke(66, 134, 244);
      strokeWeight(3);
      line(0, 0, 20, 0);
      pop();
    }
  }

  // Wyeksportowanie jedynie stanu lokalnego gracza x,y, kąt, nick
  exportPlayerState();
  exportLasers();
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

// function drawLaser(laser) {
//   push();
//   translate(laser.x, laser.y);
//   rotate(laser.angle - PI / 2);
//   stroke(232, 41, 44);
//   strokeWeight(3);
//   line(0, 0, 20, 0);
//   pop();
// }

function exportPlayerState() {
  var data = {
    x: p.pos.x,
    y: p.pos.y,
    angle: p.angle,
    nick: nick
    // lasers: p.lasers
  };
  socket.emit("update", data);
}
function exportLasers() {
  var data = [];
  for (var i = 0; i < p.lasers.length; i++) {
    var laser = {
      x: p.lasers[i].pos.x,
      y: p.lasers[i].pos.y,
      angle: p.lasers[i].angle
    };
    data.push(laser);
  }
  socket.emit("updateLasers", data);
}

function keyPressed() {
  if (key == " ") {
    // var vel = p5.Vector.fromAngle(p.angle - PI / 2).mult(40);
    // var newLaser = {
    //   id: socket.id,
    //   velX: vel.x,
    //   velY: vel.y,
    //   x: p.pos.x,
    //   y: p.pos.y,
    //   angle: p.angle
    // };
    // socket.emit("addLaser", newLaser);
    var laser = new Laser(p.pos.x, p.pos.y, p.angle);
    p.lasers.push(laser);
  }
}

var input = document.getElementById("input");
var submit = document.getElementById("submit");
var form = document.getElementById("form");

submit.addEventListener("click", function() {
  nick = input.value;
  form.style.opacity = 0;
});
