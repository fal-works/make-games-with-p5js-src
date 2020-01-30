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

function playerIsAlive(entity) {
  // プレイヤーの位置が生存圏内なら true を返す。
  // 600 は画面の下端
  return entity.y < 600;
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

// 複数のエンティティを処理する関数

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
 *
 * @param entityA 衝突しているかどうかを確認したいエンティティ
 * @param entityB 同上
 * @param collisionXDistance 衝突しないギリギリのx距離
 * @param collisionYDistance 衝突しないギリギリのy距離
 * @returns 衝突していたら `true` そうでなければ `false` を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {
  // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}

// ---- 画面効果 ---------------------------------------------------------------

// スクリーンシェイク

/** シェイクの現在の強さ */
let shakeMagnitude;

/** シェイクの減衰に使う係数 */
let shakeDampingFactor;

/** シェイクをリセット */
function resetShake() {
  shakeMagnitude = 0;
  shakeDampingFactor = 0.95;
}

/** シェイクを任意の強さで発動 */
function setShake(magnitude) {
  shakeMagnitude = magnitude;
}

/** シェイクを更新 */
function updateShake() {
  shakeMagnitude *= shakeDampingFactor; // シェイクの大きさを徐々に減衰
}

/** シェイクを適用。描画処理の前に実行する必要あり */
function applyShake() {
  if (shakeMagnitude < 1) return;

  // currentMagnitude の範囲内で、ランダムに画面をずらす
  translate(
    random(-shakeMagnitude, shakeMagnitude),
    random(-shakeMagnitude, shakeMagnitude)
  );
}

// スクリーンフラッシュ

/** フラッシュのα値 */
let flashAlpha;

/** フラッシュの持続時間（フレーム数） */
let flashDuration;

/** フラッシュの残り時間（フレーム数） */
let flashRemainingCount;

/** フラッシュをリセット */
function resetFlash() {
  flashAlpha = 255;
  flashDuration = 1;
  flashRemainingCount = 0;
}

/** フラッシュを、任意のα値と持続時間で発動 */
function setFlash(alpha, duration) {
  flashAlpha = alpha;
  flashDuration = duration;
  flashRemainingCount = duration;
}

/** フラッシュを更新 */
function updateFlash() {
  flashRemainingCount -= 1;
}

/** フラッシュを適用。描画処理の後に呼ぶ必要あり */
function applyFlash() {
  if (flashRemainingCount <= 0) return;

  let alphaRatio = flashRemainingCount / flashDuration;
  background(255, alphaRatio * flashAlpha);
}

// ---- ゲーム全体に関わる変数と関数 --------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティの配列 */
let blocks;

/** ゲームの状態。"play" か "gameover" を入れるものとする */
let gameState;

/** ブロックを上下ペアで作成し、`blocks` に追加する */
function addBlockPair() {
  let y = random(-100, 100);
  blocks.push(createBlock(y)); // 上のブロック
  blocks.push(createBlock(y + 600)); // 下のブロック
}

/** ゲームオーバー画面を表示する */
function drawGameOverScreen() {
  background(0, 192);
  fill(255);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);
}

/** ゲームのリセット */
function resetGame() {
  // 状態をリセット
  gameState = "play";

  // プレイヤーを作成
  player = createPlayer();

  // ブロックの配列準備
  blocks = [];

  // 画面効果をリセット
  resetShake();
  resetFlash();
}

function setGameOver() {
  gameState = "gameover";
  setShake(300);
  setFlash(128, 60);
}

/** ゲームの更新 */
function updateGame() {
  // 画面効果を更新
  updateShake();
  updateFlash();

  if (gameState !== "play") return;

  // ブロックの追加と削除
  if (frameCount % 120 === 1) addBlockPair(blocks); // 一定間隔でブロック追加
  blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す

  // 全エンティティの位置を更新
  updatePosition(player);
  for (let block of blocks) updatePosition(block);

  // プレイヤーに重力を適用
  applyGravity(player);

  // プレイヤーが死んでいたらゲームオーバー
  if (!playerIsAlive(player)) {
    setGameOver();
    return;
  }

  // 衝突判定
  for (let block of blocks) {
    if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
      setGameOver();
      break;
    }
  }
}

/** ゲームの描画 */
function drawGame() {
  // スクリーンシェイクを適用
  applyShake();

  // 全エンティティを描画
  background(0);
  drawPlayer(player);
  for (let block of blocks) drawBlock(block);

  // ゲームオーバー状態なら、それ用の画面を表示
  if (gameState === "gameover") drawGameOverScreen();

  // スクリーンフラッシュを適用
  applyFlash();
}

/** マウスボタンが押されたときのゲームへの影響 */
function onMousePress() {
  switch (gameState) {
    case "play":
      // プレイ中の状態ならプレイヤーをジャンプさせる
      applyJump(player);
      break;
    case "gameover":
      // ゲームオーバー状態ならリセット
      resetGame();
      break;
  }
}

// ---- setup/draw 他 ----------------------------------------------------------

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);

  resetGame();
}

function draw() {
  updateGame();
  drawGame();
}

function mousePressed() {
  onMousePress();
}