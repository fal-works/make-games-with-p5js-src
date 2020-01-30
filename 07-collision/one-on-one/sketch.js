function drawEntityGuide(entity) {
  const { x, y } = entity;
  push();

  noStroke();
  fill(255, 0, 0);
  circle(x, y, 12);

  stroke(255, 0, 0, 160);
  line(x, 0, x, height);
  line(0, y, width, y);

  pop();
}

function createPlayer() {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0
  };
}

function drawPlayer(entity) {
  square(entity.x, entity.y, 40);
}

function createBlock(y) {
  return {
    x: 500,
    y,
    vx: -2,
    vy: 0
  };
}

function drawBlock(entity) {
  rect(entity.x, entity.y, 80, 400);
}

const player = createPlayer();
const block = createBlock(300);
const playerCollisionXDistance = 20;
const playerCollisionYDistance = 20;
const blockCollisionXDistance = 40;
const blockCollisionYDistance = 200;
const collisionXDistance = playerCollisionXDistance + blockCollisionXDistance;
const collisionYDistance = playerCollisionYDistance + blockCollisionYDistance;
let xDistance = 0;
let yDistance = 0;
let xCollision = false;
let yCollision = false;

function checkCollision() {
  xDistance = abs(player.x - block.x);
  yDistance = abs(player.y - block.y);
  xCollision = xDistance < collisionXDistance;
  yCollision = yDistance < collisionYDistance;
}

function drawCollisionGuide() {
  const mx = (player.x + block.x) / 2;
  const my = (player.y + block.y) / 2;
  const guideX = 20;
  const guideY = height - 20;

  push();
  rectMode(CORNERS);

  strokeWeight(3);
  if (xCollision) stroke(255, 64, 64);
  else stroke(255);
  line(player.x, guideY, block.x, guideY);
  if (yCollision) stroke(255, 64, 64);
  else stroke(255);
  line(guideX, player.y, guideX, block.y);

  noStroke();
  if (xCollision) {
    fill(64, 255, 64, 64);
    if (player.x < block.x)
      rect(
        player.x + playerCollisionXDistance,
        0,
        block.x - blockCollisionXDistance,
        height
      );
    else
      rect(
        block.x + blockCollisionXDistance,
        0,
        player.x - playerCollisionXDistance,
        height
      );
  }
  if (yCollision) {
    fill(64, 255, 64, 64);
    if (player.y < block.y)
      rect(
        0,
        player.y + playerCollisionYDistance,
        width,
        block.y - blockCollisionYDistance
      );
    else
      rect(
        0,
        block.y + blockCollisionYDistance,
        width,
        player.y - playerCollisionYDistance
      );
  }

  textSize(24);
  if (xCollision) fill(255, 64, 64);
  else fill(255);
  textAlign(CENTER, BOTTOM);
  text(`dx: ${Math.round(xDistance)}`, mx, guideY - 10);
  if (yCollision) fill(255, 64, 64);
  else fill(255);
  textAlign(LEFT, CENTER);
  text(`dy: ${Math.round(yDistance)}`, guideX + 10, my);

  pop();
}

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);
}

function draw() {
  background(0);
  checkCollision();
  if (xCollision && yCollision) fill(192, 192, 255);
  else fill(255);
  drawBlock(block);
  drawPlayer(player);
  drawEntityGuide(block);
  drawEntityGuide(player);
  drawCollisionGuide();
}

function mouseMoved() {
  player.x = mouseX;
  player.y = mouseY;
}
