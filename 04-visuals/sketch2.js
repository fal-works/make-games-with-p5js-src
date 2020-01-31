// ---- エンティティ関連の関数 --------------------------------------------------

// 全エンティティ共通

function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
}

// プレイヤーエンティティ用

function createPlayer() {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0
  };
}

function applyGravity(entity) {
  entity.vy += 0.15;
}

function applyJump(entity) {
  entity.vy = -5;
}

function drawPlayer(entity) {
  noFill();
  strokeWeight(6);
  stroke(255);
  let time = frameCount * 0.2;
  let transformValue = 5 * sin(time);
  let width = 56 + transformValue;
  let height = 56 - transformValue;
  ellipse(entity.x, entity.y, width, height);
}

// ブロックエンティティ用

function createBlock(y) {
  return {
    x: 900,
    y,
    vx: -2,
    vy: 0
  };
}

function drawBlock(entity) {
  push();

  translate(entity.x, entity.y);
  blendMode(ADD);
  strokeWeight(8);
  noFill();

  stroke(128);
  rect(0, 0, 80, 400);

  // noise() の扱いが雑なのと無駄が多いのとで、あまり良いコードではありません

  let x, y;
  let noiseTime = frameCount * 0.03;

  stroke(192, 0, 0);
  x = 50 * (-0.5 + noise(noiseTime));
  y = 50 * (-0.5 + noise(noiseTime + 100));
  rect(x, y, 80, 400);

  stroke(0, 128, 0);
  x = 50 * (-0.5 + noise(noiseTime + 200));
  y = 50 * (-0.5 + noise(noiseTime + 300));
  rect(x, y, 80, 400);

  stroke(0, 0, 128);
  x = 50 * (-0.5 + noise(noiseTime + 400));
  y = 50 * (-0.5 + noise(noiseTime + 500));
  rect(x, y, 80, 400);

  pop();
}

// ---- ゲーム全体に関わる部分 --------------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティ */
let block;

// ---- setup/draw 他 ----------------------------------------------------------

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);

  // プレイヤーを作成
  player = createPlayer();

  // ブロックを作成
  block = createBlock(300); // とりあえず画面中央の高さで
}

function draw() {
  // 全エンティティの位置を更新
  updatePosition(player);
  updatePosition(block);

  // プレイヤーに重力を適用
  applyGravity(player);

  // 全エンティティを描画
  background(0, 0, 32);
  drawPlayer(player);
  drawBlock(block);
}

function mousePressed() {
  // プレイヤーをジャンプさせる
  applyJump(player);
}
