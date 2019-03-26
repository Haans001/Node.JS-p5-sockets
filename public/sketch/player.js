class Player {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.acc = createVector();
    this.vel = createVector();
    // this.width = width;
    // this.height = height;

    this.r = r;
    this.angle = 0;
  }

  run(name) {
    this.moving();
    this.update();
    this.show(name);
    // this.edges();
  }

  update() {
    this.vel = p5.Vector.add(this.acc, this.vel);
    this.pos = p5.Vector.add(this.vel, this.pos);
    this.acc.mult(0);
    this.vel.mult(0.95);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;

    if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;

    if (this.pos.y < 0) this.pos.y = height;
  }

  show(name) {
    push();
    strokeWeight(1);
    text(name, this.pos.x - 15, this.pos.y - 30);
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(220, 0, 200);
    fill(153, 35, 74);
    strokeWeight(2);
    triangle(
      -(this.r / 2),
      this.r / 2,
      this.r / 2,
      this.r / 2,
      0,
      (-this.r * 2) / 3
    );
    pop();
  }

  moving() {
    if (keyIsDown(LEFT_ARROW)) this.angle -= 0.1;

    if (keyIsDown(RIGHT_ARROW)) this.angle += 0.1;

    if (keyIsDown(UP_ARROW)) {
      this.acc.add(p5.Vector.fromAngle(this.angle - PI / 2).mult(0.5));
    }
  }
}
