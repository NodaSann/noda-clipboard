let canvasPosition;

function setup() {
  var cnv = createCanvas(80, 80);
  // 使画布的左上角在页面的右上角，且有四分之一在页面内
  // cnv.position(windowWidth - 20, 0);
  canvasPosition = cnv.position();
}

function draw() {
  // background(100, 200, 200);

  // 计算鼠标相对于右上角画布的位置
  let x = mouseX;
  let y = mouseY;

  // 由于眼球始终要向左下角看
  // 使用映射让瞳孔的移动更加自然
  let moveX = map(x, 0, windowWidth - 20, 0, -1);
  let moveY = map(y, 0, windowHeight, 0, 1);

  // 绘制白色的眼睛背景
  noStroke();
  fill(255);
  ellipse(40, 40, 80, 80);

  // 计算瞳孔位置，确保瞳孔始终在眼睛内部
  let pupilX = 40 + 20 * -1*moveX;
  let pupilY = 40 + 20 *moveY;

  // 强制瞳孔位置保持在眼睛的可见区域内
  if (pupilX + 8 > 80) pupilX = 80 - 28;
  if (pupilY + 8 > 80) pupilY = 80 -12;
  if (pupilX < 8) pupilX = 8-24;
  if (pupilY < 8) pupilY = 8+24;

  // 绘制移动的瞳孔
  fill(0);
  circle(pupilX, pupilY, 16);

  // 按下鼠标则闭眼
  if (mouseIsPressed) {
    fill(255,255,255);
    ellipse(40, 40, 80, 80);
  }
}

// function windowResized() {
//   createCanvas(80, 80).position(windowWidth - 20, 0);
// }