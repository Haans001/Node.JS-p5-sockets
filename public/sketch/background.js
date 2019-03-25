class Background {
  constructor(x, y, a, w) {
    this.x = x;
    this.y = y;
    this.alpha = a;
    this.weight = w;
  }

  display() {
    stroke(255, this.alpha);
    fill(255);
    strokeWeight(this.weight);
    point(this.x, this.y);
  }
}
