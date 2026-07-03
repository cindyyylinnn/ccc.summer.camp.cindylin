// let color_palette = ["#9DADBE", "#5D759A", "#222837", "#945031"];
// let basePalette = ["#78ade5", "#465365"];
let color_palette;
let basePalette;
let padding = 200;

async function setup() {
  pixelDensity(1); // 輸出正好 2000x1400 px（符合作業規格）
  createCanvas(2000, 1400); // 畫布大小：width, height

  let color_rand = random();
  // features setting
  if (color_rand < 0.33) {
    // "light purple pink"
    color_palette = ["#E6B3E0", "#D8BFD8", "#C8A2D0", "#B19CD9", "#AEC6E8"];
    basePalette = ["#F5E6F0"];
  } else if (color_rand < 0.66) {
    // "deep purple"
    color_palette = ["#C8A2D0", "#B19CD9", "#9D7BB5", "#8B6BA8", "#9DBBE0"];
    basePalette = ["#E8D5E8"];
  } else {
    // "purple mix"
    color_palette = [
      "#E6B3E0",
      "#C8A2D0",
      "#B19CD9",
      "#DDA0DD",
      "#BA55D3",
      "#D8BFD8",
      "#AEC6E8",
      "#9DBBE0",
    ];
    basePalette = ["#F0E6F5"];
  }

  background(random(basePalette)); // 背景顏色
  colorMode(HSB);

  let xsum = 0;
  let ysum = 10;
  let yCount = 30;

  for (let i = 0; i < 100; i++) {
    let R = 4;
    let xSpan = R + 5;
    let ySpan = R + 5;
    let xCount = int(random(60, 100));
    let x = xsum;
    let y = ysum;

    RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);
    xsum = xsum + xCount * xSpan;

    if (xsum > width) {
      ysum = ysum + yCount * ySpan;
      yCount = int(random(30, 50));
      xsum = 0;
    }
  }
}

//呼叫自己建立的函式
// RJ_rect(100, 200, 10, 50, 10, 20, 5);

// let xsum = 0;
// // 使用迴圈繪製 - 底色層
// for (let i = 0; i < 30; i++) {
//   let x = xsum;
//   let y = 0;
//   let xCount = int(random(20, 100));
//   let yCount = 300;
//   let R = 4;
//   let xSpan = R + random(2, 5);
//   let ySpan = R + random(3);

//   RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);
//   xsum += xCount * xSpan;
//   // await sleep(10);
// }

// 使用迴圈重複繪製 - 中間層
// for (let i = 0; i < 200; i++) {
//   let x = random(-padding, width);
//   let y = random(-padding, height);
//   let xCount = int(random(5, 100));
//   let yCount = int(random(20, 300));
//   let R = 4;
//   let xSpan = R + random(2, 5);
//   let ySpan = R + random(3);
//   RJ_rect(x, y, xCount, yCount, xSpan, ySpan, R);
//   // await sleep(10);
// }

// 只畫一次

// function heart(x, y, size) {
//   beginShape();
//   vertex(x, y);
//   bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
//   bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
//   endShape(CLOSE);
// }

// _x: 起始x座標, _y: 起始y座標, _xCount: x方向點點排數, _yCount: y方向點點排數, _xSpan: x方向間距, _ySpan: y方向間距, _R: 點點大小
function RJ_rect(_x, _y, _xCount, _yCount, _xSpan, _ySpan, _R) {
  let mainClr = random(color_palette); // 隨機選一個顏色
  let fade_scale = random(0.12, 0.5); // 底部淡化幅度（小=更密實鋪滿）

  //拆解顏色，做出浪板的明暗層次
  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);
  let hiClr = color(random(198, 214), random(30, 50), 100); // 脊頂反光（淺藍，突顯對比）
  let lightClr = color(mainHue, max(mainSat - 4, 0), min(mainBri + 30, 100)); // 亮面
  let baseClr = color(mainHue, min(mainSat + 18, 100), mainBri); // 主色（加飽和更濃）
  let darkClr = color(mainHue, min(mainSat + 24, 100), max(mainBri - 36, 0)); // 凹谷陰影

  // 斑駁生鏽：沿用紫色系，用偏暗的紫棕當鏽色（想要經典橘鏽可改成 "#945031"）
  let rustClr = color((mainHue + 18) % 360, min(mainSat + 22, 100), max(mainBri - 18, 0));

  let corrPeriod = random(14, 26); // 浪板脊距：每塊略不同，讓脊的寬窄不一
  let warpAmt = random(6, 14); // 相位扭曲強度：越大脊越不規則
  let noiseStep = 0.012; // 生鏽斑塊大小：越大斑塊越碎
  let rustRnd = random(); // 這排要不要生鏽

  // 繪製點點矩陣
  for (let i = 0; i < _xCount; i++) {
    let px = i * _xSpan + _x; // 計算 x 座標

    // 浪板的連續光影：用 noise 扭曲 sin 相位 -> 脊的寬窄不規則
    let warp = noise(px * 0.0035) * warpAmt;
    let corr = sin(px / corrPeriod + warp); // -1(凹谷) ~ 1(脊頂)
    let valley = constrain(-corr, 0, 1); // 凹谷=1，脊頂=0

    for (let j = 0; j < _yCount; j++) {
      let py = j * _ySpan + _y; // 計算 y 座標

      let fade_rate = j / _yCount; // 0-1
      fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      if (random() > fade_rate) {
        push(); // 儲存畫布目前狀態
        translate(px, py); // 移動畫布原點（浪板脊線保持垂直）
        noStroke(); // 不要外框線

        // 沿 y 緩慢變化 -> 脊的長短、斷續不一（有些脊會淡掉、斷開）
        let streak = constrain(
          map(noise(px * 0.003, py * 0.0016), 0.38, 0.72, 0.25, 1.35),
          0.25,
          1.35
        );
        let lit = corr * streak; // 浪板光影強度（含長度變化）

        // 依浪板光影分四層明度：反光 / 亮面 / 主色 / 凹谷陰影
        let clr;
        if (lit > 0.9) clr = hiClr;
        else if (lit > 0.45) clr = lightClr;
        else if (lit < -0.5) clr = darkClr;
        else clr = baseClr;
        fill(clr);

        let r = _R * random(0.85, 1.15) + random(0.4, 0.8);
        circle(0, 0, r);

        // 生鏽/斑駁：用 noise 產生斑塊，並集中在浪板凹谷
        if (rustRnd < 0.5) {
          let n = noise(px * noiseStep, py * noiseStep);
          let rustAmt = valley * constrain(map(n, 0.45, 0.72, 0, 1), 0, 1);
          if (rustAmt > 0.3 && random() < rustAmt) {
            fill(rustClr);
            circle(0, 0, r * random(0.5, 0.9));
          }
        }

        pop(); // 回復至畫布先前狀態
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
