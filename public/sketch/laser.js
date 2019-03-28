class Laser {
  constructor(x, y, a) {
    this.pos = createVector(x, y);
    this.angle = a - PI / 2;
    this.len = 20;
    this.vel = createVector();
    this.vel.add(p5.Vector.fromAngle(this.angle)).mult(7);
  }

  update() {
    this.pos.add(this.vel);
  }

  offScreen() {
    return (
      this.pos.x > width * 3 - this.len ||
      this.pos.x < -width - this.len ||
      this.pos.y > height * 3 - this.len ||
      this.pos.y < -height - this.len
    );
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    stroke(66, 134, 244);
    strokeWeight(3);
    line(0, 0, this.len, 0);
    pop();
  }
}
