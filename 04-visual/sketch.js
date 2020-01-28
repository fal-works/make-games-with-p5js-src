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
  stroke(320, 30, 80);
  stroke(20);
  strokeWeight(4);
  fill(320, 30, 100);
  square(entity.x, entity.y, 40, 8);
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
  stroke(200, 90, 80);
  stroke(20);
  strokeWeight(4);
  fill(200, 90, 100);
  rect(entity.x, entity.y, 81, 400, 8);
}

// ---- ゲーム全体に関わる変数 --------------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティ */
let block;

// ---- setup/draw 他 ----------------------------------------------------------

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);

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
  background(255);
  drawPlayer(player);
  drawBlock(block);
}

function mousePressed() {
  // プレイヤーをジャンプさせる
  applyJump(player);
}
