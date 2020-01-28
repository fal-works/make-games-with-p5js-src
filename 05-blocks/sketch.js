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
  square(entity.x, entity.y, 40);
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
  rect(entity.x, entity.y, 80, 400);
}

function blockIsAlive(entity) {
  // ブロックの位置が生存圏内なら true を返す。
  // -100 は適当な値（ブロックが見えなくなる位置であればよい）
  return -100 < entity.x;
}

// ---- ゲーム全体に関わる変数と関数 --------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティの配列 */
let blocks;

/**
 * ブロックを上下ペアで作成し、`blocks` に追加する
 */
function addBlockPair() {
  const y = random(-100, 100);
  blocks.push(createBlock(y)); // 上のブロック
  blocks.push(createBlock(y + 600)); // 下のブロック
}

// ---- setup/draw 他 ----------------------------------------------------------

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);

  // プレイヤーを作成
  player = createPlayer();

  // ブロックの配列準備
  blocks = [];
}

function draw() {
  // ブロックの追加と削除
  if (frameCount % 120 === 1) addBlockPair(blocks); // 一定間隔でブロック追加
  blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す

  // 全エンティティの位置を更新
  updatePosition(player);
  for (const block of blocks) updatePosition(block);

  // プレイヤーに重力を適用
  applyGravity(player);

  // 全エンティティを描画
  background(0);
  drawPlayer(player);
  for (const block of blocks) drawBlock(block);
}

function mousePressed() {
  // プレイヤーをジャンプさせる
  applyJump(player);
}
