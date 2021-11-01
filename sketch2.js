/* eslint no-unused-vars: "off", max-len: {"code":200},no-undef: "off" */
/// <reference path="/Users/matty/Dropbox/synthetic media/VSCODE/_PROJECT TEMPLATE NEW/TSDef/p5.global-mode.d.ts" />

//PRNG
class NewRandom {
  constructor(seed) {
    this.seed = seed;
  }
  random_dec() {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }
  random_between(a, b) {
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    return Math.floor(this.random_between(a, b + 1));
  }
  random_choice(x) {
    return x[Math.floor(this.random_between(0, x.length * 0.99))];
  }
}

//hash stuff, temporarily get a random one
function random_hash() {
  let chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

//===Seed stuff
tokenData = {hash: random_hash()};
//fixed hash:
//tokenData = { hash: "0x55ac46671239943c1111410215501820fc414444fff3495bf77aeed734446666" };
//tokenData = { hash: "0x6666667676767676767676767676767676767676767676767676767676767676" };
//tokenData = { hash: "0x6666667676712344321654321654321654321654321654767676763216543216" };
let hash = tokenData.hash;

let seed = parseInt(tokenData.hash.slice(2, 10), 16);
let R = new NewRandom(seed);

//load helper image
let img;
function preload() {
  img = loadImage("imgs/gmishoot.jpeg");
}
//polar to cartesian
function p2c(r, theta) {
  let x = r * cos(theta);
  let y = r * sin(theta);
  return [x, y];
}
//cartesian to polar
function c2p(x, y) {
  x -= cx;
  y -= cy;
  distance = sqrt(x * x + y * y);
  degg = atan2(y, x); //This takes y first
  //round
  degg = round(degg * 10) / 10;
  if (degg < 0) degg += 360;
  distance = round((32 * distance * 10) / go.radi) / 10;
  polarCoor = [distance, degg];
  return polarCoor;
}

function drawCurve(pts, offsetx = 0, offsety = 0, mirror = false) {
  push();
  translate(cx, cy);
  noFill();
  stroke(30, 50);
  strokeWeight(1);
  offsetx = mirror ? -offsetx : offsetx;
  beginShape();
  for (var i = 0; i < pts.length; i++) {
    if (mirror) {
      pts[i][0] *= -1;
    }
    curveVertex(pts[i][0] + offsetx, pts[i][1] + offsety);
  }
  endShape();

  //debug:draw helper circles
  stroke(0, 0, 255, 45);
  strokeWeight(1);
  for (var i = 0; i < pts.length; i++) {
    if (!mirror) circle(pts[i][0] + offsetx, pts[i][1] + offsety, ppw);
  }
  pop();
}

function drawCurve2(pts0, pts1, offsetx = 0, offsety = 0, mirror = false) {
  push();
  translate(cx, cy);
  noFill();
  stroke(30, 50);
  strokeWeight(2);
  offsetx = mirror ? -offsetx : offsetx;
  beginShape();
  //first point twice
  if (pts0.length > 1) {
    var pnt = [];
    pnt[0] = map(go.gr, 0, 1, pts0[0][0], pts1[0][0]);
    pnt[1] = map(go.gr, 0, 1, pts0[0][1], pts1[0][1]);
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  for (var i = 0; i < pts0.length; i++) {
    var pnt = [];
    pnt[0] = map(go.gr, 0, 1, pts0[i][0], pts1[i][0]);
    pnt[1] = map(go.ga, 0, 1, pts0[i][1], pts1[i][1]);
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  //last point twice
  if (pts1.length > 1) {
    var pnt = [];
    pnt[0] = map(go.gr, 0, 1, pts0[pts1.length - 1][0], pts1[pts1.length - 1][0]);
    pnt[1] = map(go.gr, 0, 1, pts0[pts1.length - 1][1], pts1[pts1.length - 1][1]);
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  endShape();

  //debug:draw helper circles
  /*
  stroke(0, 0, 255, 45);
  strokeWeight(1);
  for (var i = 0; i < pts0.length; i++) {
    var pnt = [];
    pnt[0] = map(go.gr, 0, 1, pts0[i][0], pts1[i][0]);
    pnt[1] = map(go.ga, 0, 1, pts0[i][1], pts1[i][1]);
    if (!mirror) circle(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety, ppw);
  }*/
  pop();
}

function drawAll() {
  for (var i = 0; i < curves.length; i++) {
    if (go.randomgr) go.gr = R.random_dec();
    drawCurve2(curves[i].points0, curves[i].points1);
    if (curves[i].mirror) drawCurve2(curves[i].points0, curves[i].points1, 0, 0, true);
  }
  if (go.randomgr) go.randomgr = false;
}

//handling manual draws =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==============================
//========================================================================================
//========================================================================================
function drawManual() {
  drawManualCurve(manualCurve0, manualCurve1, 0, 0, false);
  if (go.mirror) drawManualCurve(manualCurve0, manualCurve1, 0, 0, true);
}

function updateSaveme() {
  let str = "{points0:[";
  for (var i = 0; i < manualCurve0.length; i++) {
    str += "[" + manualCurve0[i][0].toString() + "," + manualCurve0[i][1].toString() + "],";
  }
  str += "], points1:[";
  for (var i = 0; i < manualCurve1.length; i++) {
    str += "[" + manualCurve1[i][0].toString() + "," + manualCurve1[i][1].toString() + "],";
  }
  str += "], mirror:";
  if (go.mirror) {
    str += "true,}";
  } else {
    a = str += "false,}";
  }
  go.saveme = str;
}

function keyPressed(e) {
  if (e.keyCode == 90) {
    manualCurve0.pop();
    manualCurve1.pop();
  }
}

function mousePressed() {
  if (go.tool != "Erase") {
    if (activePt == -1 && mouseX < DIM) {
      manualCurve0.push(c2p(mouseX, mouseY));
      manualCurve1.push(c2p(mouseX - 150, mouseY - 150));
    }
  } else {
    if (activePt == -1) {
      //nothing
    } else if (activePt < manualCurve0.length) {
      manualCurve0.splice(activePt, 1);
      manualCurve1.splice(activePt - manualCurve0.length, 1);
    }
  }
  updateSaveme();
}

function mouseMoved() {
  activePt = -1;
  var mx = mouseX - cx;
  var my = mouseY - cy;
  for (var i = 0; i < manualCurve0.length; i++) {
    var tx = ((manualCurve0[i][0] * go.radi) / 32) * cos(manualCurve0[i][1]);
    var ty = ((manualCurve0[i][0] * go.radi) / 32) * sin(manualCurve0[i][1]);
    if (dist(tx, ty, mx, my) < ppw) {
      activePt = i;
    }
  }
  for (var i = 0; i < manualCurve1.length; i++) {
    var tx = ((manualCurve1[i][0] * go.radi) / 32) * cos(manualCurve1[i][1]);
    var ty = ((manualCurve1[i][0] * go.radi) / 32) * sin(manualCurve1[i][1]);
    if (dist(tx, ty, mx, my) < ppw) {
      activePt = i + manualCurve0.length;
    }
  }
}

function mouseDragged() {
  if (activePt == -1) {
    //nothing
  } else if (activePt < manualCurve0.length) {
    manualCurve0[activePt] = c2p(mouseX, mouseY);
  } else {
    manualCurve1[activePt - manualCurve0.length] = c2p(mouseX, mouseY);
  }
  updateSaveme();
}

function drawManualCurve(pts0, pts1, offsetx = 0, offsety = 0, mirror = false) {
  push();
  translate(cx, cy);
  offsetx = mirror ? -offsetx : offsetx;

  //0 line
  stroke("blue");
  if (go.fill) {
    fill(0, 0, 255, 30);
    strokeWeight(1);
  } else {
    noFill();
    strokeWeight(3);
  }
  beginShape();
  //first point twice
  if (pts0.length > 1) {
    var pnt = [];
    pnt[0] = pts0[0][0];
    pnt[1] = pts0[0][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  for (var i = 0; i < pts0.length; i++) {
    var pnt = [];
    pnt[0] = pts0[i][0];
    pnt[1] = pts0[i][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  //last point twice
  if (pts0.length > 1) {
    var pnt = [];
    pnt[0] = pts0[pts0.length - 1][0];
    pnt[1] = pts0[pts0.length - 1][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  endShape();
  //line 0 circles
  for (var i = 0; i < pts0.length; i++) {
    if (activePt == i) {
      noStroke();
      fill(255, 0, 0, 128);
    } else {
      noFill();
      strokeWeight(1);
      stroke(255, 0, 0, 128);
    }
    var pnt = [];
    pnt[0] = pts0[i][0];
    pnt[1] = pts0[i][1];
    if (!mirror) {
      circle(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety, ppw * 2);
      if (i == 0) circle(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety, 4);
    }
  }
  //1 line
  stroke("green");
  if (go.fill) {
    fill(0, 2550, 0, 30);
    strokeWeight(1);
  } else {
    noFill();
    strokeWeight(3);
  }
  beginShape();
  //first point twice
  if (pts1.length > 1) {
    var pnt = [];
    pnt[0] = pts1[0][0];
    pnt[1] = pts1[0][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  for (var i = 0; i < pts1.length; i++) {
    var pnt = [];
    pnt[0] = pts1[i][0];
    pnt[1] = pts1[i][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  //last point twice
  if (pts1.length > 1) {
    var pnt = [];
    pnt[0] = pts1[pts1.length - 1][0];
    pnt[1] = pts1[pts1.length - 1][1];
    if (mirror) {
      curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    } else {
      curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
    }
  }
  endShape();
  //line 1 circles
  for (var i = 0; i < pts1.length; i++) {
    if (activePt == i + pts0.length) {
      noStroke();
      fill(0, 255, 0, 200);
    } else {
      noFill();
      strokeWeight(1);
      stroke(0, 255, 0, 200);
    }
    var pnt = [];
    pnt[0] = pts1[i][0];
    pnt[1] = pts1[i][1];
    if (!mirror) circle(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety, ppw * 2);
  }

  //interpolated line
  if (go.gr != 0 && go.gr != 1) {
    stroke("grey");
    if (go.fill) {
      fill(0, 0, 0, 10);
      strokeWeight(1);
    } else {
      noFill();
      strokeWeight(2);
    }
    beginShape();
    //first point twice
    if (pts0.length > 1) {
      var pnt = [];
      pnt[0] = map(go.gr, 0, 1, pts0[0][0], pts1[0][0]);
      pnt[1] = map(go.gr, 0, 1, pts0[0][1], pts1[0][1]);
      if (mirror) {
        curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      } else {
        curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      }
    }
    for (var i = 0; i < pts0.length; i++) {
      var pnt = [];
      pnt[0] = map(go.gr, 0, 1, pts0[i][0], pts1[i][0]);
      pnt[1] = map(go.gr, 0, 1, pts0[i][1], pts1[i][1]);
      if (mirror) {
        curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      } else {
        curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      }
    }
    //last point twice
    if (pts1.length > 1) {
      var pnt = [];
      pnt[0] = map(go.gr, 0, 1, pts0[pts1.length - 1][0], pts1[pts1.length - 1][0]);
      pnt[1] = map(go.gr, 0, 1, pts0[pts1.length - 1][1], pts1[pts1.length - 1][1]);
      if (mirror) {
        curveVertex(((-pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      } else {
        curveVertex(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety);
      }
    }
    endShape();

    //interp circles
    noStroke();
    fill(0, 0, 0, 50);
    for (var i = 0; i < pts1.length; i++) {
      var pnt = [];
      pnt[0] = map(go.gr, 0, 1, pts0[i][0], pts1[i][0]);
      pnt[1] = map(go.gr, 0, 1, pts0[i][1], pts1[i][1]);
      if (!mirror) circle(((pnt[0] * go.radi) / 32) * cos(pnt[1]) + offsetx, ((pnt[0] * go.radi) / 32) * sin(pnt[1]) + offsety, 6);
    }
  }
  pop();
}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-================================================
function loadCurves() {
  //bottom hair
  /* prettier-ignore */
  /* original (by matty)
  curves.push({ //bottom hairline
    points0:[[27, 255],[27, 270],[28, 285],[28, 300],[28, 315],[26, 330],[25, 340],[25, 353],[26, 365],[25, 370],],
    points1:[[40, 255],[40, 270],[39, 285],[38, 300],[34, 315],[31, 330],[30, 340],[28, 353],[26, 365],[25, 370],],
    mirror:true,
  });*/
  /* prettier-ignore 
  curves.push({//top hairline
    points0: [[42, 255],[42, 270],[41, 285],[38.5, 300],[36, 315],[33, 330],[30.5, 345],[29.5, 353],[29, 358.5],[29, 10],],
    points1: [[48, 255],[48, 270],[48, 285],[46, 300],[43, 315],[38, 330],[34, 345],[32, 353],[31, 358.5],[31, 10],],
    mirror: true,
  })*/
  /* prettier-ignore */
  curves.push(//nose tip
  {points0:[[18.8,80.1],[19,82.9],[19.8,86.6],[20.2,90],], points1:[[22.3,90.2],[21.8,87.1],[19.3,81.1],[19.1,78],], mirror:true,}
  );
  /* prettier-ignore */
  curves.push(//nostril
    {points0:[[17.1,74.1],[18.3,73],[19.6,74.9],[19.7,81.9],], points1:[[16.3,74.4],[16.5,67.1],[20.2,66.6],[20.6,81.6],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//eyes
    {points0:[[6.4,6.6],[8.7,356.6],[12,353.9],[15,356.6],[16.8,0],[16.2,1.8],[14.3,6.9],[9.9,10.8],[7.5,7.3],], points1:[[5.5,2.7],[8.2,346],[12.4,345.1],[15.8,352.8],[18.1,0.6],[17.8,2.5],[14.6,13.4],[9.8,20.1],[6.1,13.3],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//eye brows
    {points0:[[8.1,314.4],[10.9,324.1],[16,336.9],[19.8,349.1],[19.2,346.3],[17.2,339.1],[15.3,331.9],[10.4,316.2],], points1:[[4.6,305.9],[10.2,327.7],[14.6,336.6],[18.2,345.9],[22.2,355.9],[17.5,337.7],[12.8,321.3],[7.3,297.7],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//upperlip
    {points0:[[27.5,90],[27.3,83.9],[28.2,80],[28.8,77],], points1:[[25.5,90],[25.2,85.7],[27.1,79.1],[28.6,73.5],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//middle lip
    {points0:[[29.8,89.8],[29.6,82.8],[30.3,79],[30.7,76.1],], points1:[[28,90.2],[27.6,82.6],[29.2,76.8],[30.1,73.6],], mirror:true,}
  );
  /* prettier-ignore */
  curves.push(//lower lip
    {points0:[[31.1,90],[31,84.2],[30.8,78.1],], points1:[[33.1,90.4],[33,84.2],[32.6,77],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//ears+jaw
    {points0:[[26,5],[28.1,359.6],[30.6,358],[32.7,0.6],[33.7,5.9],[33.1,15.9],[31.8,28.5],[29.9,35],[28,33.3],[27.1,28.6],[30.6,45.5],[33.2,55.3],[36,65.1],[41.8,79.2],[43.8,85.4],[44,90.2],], points1:[[25.8,5.4],[28.2,357.9],[31.4,354.9],[34.4,0],[37.2,9.2],[37.4,18.3],[35,29.6],[31.2,38.4],[28.4,34],[26.9,28.7],[33.1,44.1],[40.2,57.1],[43.8,66.5],[46.3,74.4],[48,83.3],[48.7,90],], mirror:true,}
    );
  /* prettier-ignore */
  curves.push(//hairline
    {points0:[[25.6,5.3],[25.1,352.8],[24.2,334.9],[25.7,326.5],[29.2,311.3],[30.9,297.6],[29,281.1],[26.9,270],], points1:[[25.9,4.6],[27.9,344.3],[29.1,330.1],[34.2,316.5],[37,307.8],[40.2,296],[41,281.8],[40.8,270],], mirror:true,}
    );
}

//bottom hairline
function prt_bhair() {
  let crv = [];
  crv.push(p2c((go.radi * 28) / 32, 255));
  crv.push(p2c((go.radi * 28) / 32, 270));
  crv.push(p2c((go.radi * 30) / 32, 285));
  crv.push(p2c((go.radi * 32) / 32, 300));
  crv.push(p2c((go.radi * 31) / 32, 315));
  crv.push(p2c((go.radi * 28) / 32, 330));
  crv.push(p2c((go.radi * 26) / 32, 340));
  crv.push(p2c((go.radi * 26) / 32, 353));
  crv.push(p2c((go.radi * 26) / 32, 365));
  crv.push(p2c((go.radi * 25) / 32, 370));
  return crv;
}
//top hairline
function prt_thair() {
  let crv = [];
  crv.push(p2c((go.radi * 44) / 32, 255));
  crv.push(p2c((go.radi * 44) / 32, 270));
  crv.push(p2c((go.radi * 43) / 32, 285));
  crv.push(p2c((go.radi * 40.5) / 32, 300));
  crv.push(p2c((go.radi * 37) / 32, 315));
  crv.push(p2c((go.radi * 33.5) / 32, 330));
  crv.push(p2c((go.radi * 30.5) / 32, 345));
  crv.push(p2c((go.radi * 29.5) / 32, 353));
  crv.push(p2c((go.radi * 29) / 32, 358.5));
  crv.push(p2c((go.radi * 29) / 32, 10));
  return crv;
}
//jaw part
function prt_jaw() {
  let crv = [];

  crv.push(p2c((go.radi * 44) / 32, 105));

  crv.push(p2c((go.radi * 44) / 32, 90));

  crv.push(p2c((go.radi * 43) / 32, 80));
  crv.push(p2c((go.radi * 36) / 32, 65));
  crv.push(p2c((go.radi * 33) / 32, 55));
  crv.push(p2c((go.radi * 30.5) / 32, 45));
  crv.push(p2c((go.radi * 27.3) / 32, 28));
  crv.push(p2c((go.radi * 26) / 32, 20));
  return crv;
}

//bottom mouth line
function prt_bmth() {
  let crv = [];
  crv.push(p2c((go.radi * 32) / 32, 75));
  crv.push(p2c((go.radi * 32) / 32, 80));
  crv.push(p2c((go.radi * 32) / 32, 90));
  crv.push(p2c((go.radi * 32) / 32, 105));
  return crv;
}
//mid mouth line right-to-left
function prt_mmth() {
  let crv = [];
  crv.push(p2c((go.radi * 32) / 32, 65));
  crv.push(p2c((go.radi * 30) / 32, 75));
  crv.push(p2c((go.radi * 28.5) / 32, 83));
  crv.push(p2c((go.radi * 28.7) / 32, 90));
  crv.push(p2c((go.radi * 32) / 32, 106));
  return crv;
}
//top mouth line
function prt_tmth() {
  let crv = [];
  crv.push(p2c((go.radi * 30) / 32, 75));
  crv.push(p2c((go.radi * 27.5) / 32, 80));
  crv.push(p2c((go.radi * 26) / 32, 85));
  crv.push(p2c((go.radi * 26.5) / 32, 90));
  crv.push(p2c((go.radi * 27.5) / 32, 105));
  return crv;
}

//ears
function prt_ear() {
  let crv = [];
  crv.push(p2c((go.radi * 26) / 32, 5));
  crv.push(p2c((go.radi * 26) / 32, 5));
  crv.push(p2c((go.radi * 28) / 32, 0));
  crv.push(p2c((go.radi * 31) / 32, -2));
  crv.push(p2c((go.radi * 34) / 32, 6));
  crv.push(p2c((go.radi * 33.5) / 32, 15));
  crv.push(p2c((go.radi * 31.5) / 32, 30));
  crv.push(p2c((go.radi * 30) / 32, 35));
  crv.push(p2c((go.radi * 28) / 32, 33));
  crv.push(p2c((go.radi * 24) / 32, 22));
  return crv;
}

//eyes
function prt_eyes() {
  //anchor pupils, left and right
  let rc = p2c((go.radi * 12) / 32, 0);
  let lc = p2c((go.radi * 12) / 32, 180);

  push();
  translate(cx, cy);
  fill(0);
  //pupils
  circle(rc[0], rc[1], go.radi / 25);
  circle(lc[0], lc[1], go.radi / 25);
  //iris
  noFill();
  stroke(30);
  strokeWeight(2);
  arc(rc[0], rc[1], go.radi / 7, go.radi / 7, -50, 90);
  arc(rc[0], rc[1], go.radi / 7, go.radi / 7, 90, 230);
  arc(lc[0], lc[1], go.radi / 7, go.radi / 7, -50, 90);
  arc(lc[0], lc[1], go.radi / 7, go.radi / 7, 90, 230);
  pop();
  /*
  let crv = []; //top arc, right from right to left
  crv.push([rc[0] - go.radi / 5, rc[1]]);
  crv.push([rc[0] - go.radi / 6, rc[1]]);
  crv.push([rc[0] - go.radi / 9, rc[1] - go.radi / 32]);
  crv.push([rc[0], rc[1] - go.radi / 15]); //top
  crv.push([rc[0] + go.radi / 9, rc[1] - go.radi / 32]);
  crv.push([rc[0] + go.radi / 6.2, rc[1]]);
  crv.push([rc[0] + go.radi / 5, rc[1]]);
  drawCurve(crv);
  drawCurve(crv, 0, 0, true);

  crv = []; //bottom arc
  crv.push([rc[0] - go.radi / 6.5, rc[1]]);
  crv.push([rc[0] - go.radi / 6.5, rc[1]]);
  crv.push([rc[0] - go.radi / 9, rc[1] + go.radi / 32]);
  crv.push([rc[0], rc[1] + go.radi / 20]); //bottom
  crv.push([rc[0] + go.radi / 9, rc[1] + go.radi / 42]);
  crv.push([rc[0] + go.radi / 6.2, rc[1] - go.radi / 32]);
  crv.push([rc[0] + go.radi / 6.2, rc[1] - go.radi / 32]);
  drawCurve(crv, 0, go.radi / 32);
  drawCurve(crv, 0, go.radi / 32, true);
  */
}

//under eye
function prt_beye() {
  let crv = [];
  crv.push(p2c((go.radi * 18) / 32, 0));
  crv.push(p2c((go.radi * 18) / 32, 5));
  crv.push(p2c((go.radi * 15) / 32, 13));
  crv.push(p2c((go.radi * 12) / 32, 19));
  crv.push(p2c((go.radi * 8) / 32, 31));
  return crv;
}

//above eye
function prt_teye() {
  let crv = [];
  crv.push(p2c((go.radi * 24) / 32, 4));
  crv.push(p2c((go.radi * 18.5) / 32, 0));
  crv.push(p2c((go.radi * 16) / 32, 351));
  crv.push(p2c((go.radi * 12.5) / 32, 342));
  crv.push(p2c((go.radi * 8) / 32, 342));
  crv.push(p2c((go.radi * 4) / 32, 345));
  return crv;
}

//low brow
function prt_bbro() {
  let crv = [];
  crv.push(p2c((go.radi * 24) / 32, 355));
  crv.push(p2c((go.radi * 19) / 32, 348));
  //crv.push(c2p((radi * 19) / 32, 340));
  crv.push(p2c((go.radi * 14) / 32, 335));
  crv.push(p2c((go.radi * 8) / 32, 315));
  crv.push(p2c((go.radi * 6) / 32, 270));
  return crv;
}
//high brow
function prt_tbro() {
  let crv = [];
  crv.push(p2c((go.radi * 24) / 32, 355));
  crv.push(p2c((go.radi * 20) / 32, 348));
  //crv.push(c2p((radi * 20) / 32, 338));
  crv.push(p2c((go.radi * 16) / 32, 332));
  crv.push(p2c((go.radi * 11) / 32, 315));
  crv.push(p2c((go.radi * 9) / 32, 270));
  return crv;
}

//nostrils, from inside out
function prt_nos1() {
  let crv = [];
  crv.push(p2c((go.radi * 20) / 32, 100));
  crv.push(p2c((go.radi * 20) / 32, 90));
  crv.push(p2c((go.radi * 19.5) / 32, 85));
  //crv.push(c2p((radi * 19.3) / 32, 85));
  crv.push(p2c((go.radi * 19) / 32, 80));
  crv.push(p2c((go.radi * 20) / 32, 75));
  return crv;
}
function prt_nos2() {
  let crv = [];
  crv.push(p2c((go.radi * 21) / 32, 90));
  crv.push(p2c((go.radi * 20) / 32, 78));
  crv.push(p2c((go.radi * 19) / 32, 73));
  crv.push(p2c((go.radi * 17) / 32, 74));
  crv.push(p2c((go.radi * 14) / 32, 80));
  return crv;
}
function prt_nose() {
  let crv = [];
  crv.push(p2c((go.radi * 4) / 32, 315));
  crv.push(p2c((go.radi * 2) / 32, 0));
  crv.push(p2c((go.radi * 4) / 32, 70));
  //crv.push(c2p((radi * 8) / 32, 76));
  crv.push(p2c((go.radi * 10) / 32, 78));
  crv.push(p2c((go.radi * 16) / 32, 82));
  crv.push(p2c((go.radi * 20) / 32, 70));
  return crv;
}

//draw helper lines
function drawHelperLines() {
  stroke(0, 0, 255, 30);
  fill(0, 10);
  strokeWeight(1);
  rectMode(CENTER);
  circle(cx, cy, go.radi * 2); //main circle
  //helper circles, from radius 0 to radi*1.5
  for (var ci = 1; ci <= num_circles; ci++) {
    noFill();
    circle(cx, cy, (ci * (go.radi * 3)) / num_circles);
    fill(0);
    textSize(7);
    text(ci * 4, cx + (ci * (go.radi * 1.5)) / num_circles - 10, cy);
  }
  //helper slices
  for (var ci = 0; ci < num_slices; ci++) {
    let angle = ci * (360 / num_slices);
    tx = cos(angle) * go.radi * 1.5;
    ty = sin(angle) * go.radi * 1.5;
    line(cx, cy, cx + tx, cy + ty);
    textSize(7);
    fill(0);
    text(angle, cx + tx + 5, cy + ty + 5);
  }
}

//add gui stuff
function addGUI() {
  go = {
    radi: DIM * 0.3,
    gr: 0,
    ga: 0,
    randomgr: false,
    tool: "None",
    fill: false,
    mirror: false,
    saveme: "[]",
    getme: "[]",
  };

  //randomize button
  var randadd = {
    add: function () {
      go.randomgr = true;
    },
  };
  //clear button
  var clearbut = {
    clr: function () {
      manualCurve0 = [];
      manualCurve1 = [];
    },
  };
  //get curve button
  var gebut = {
    getb: function () {
      var tmpcurves;
      var str = "tmpcurves = " + go.getme;
      eval(str);
      go.mirror = tmpcurves.mirror;
      manualCurve0 = tmpcurves.points0;
      manualCurve1 = tmpcurves.points1;
    },
  };

  myGUI.add(go, "radi", 10, 1000);
  myGUI.add(go, "gr", 0, 1, 0.01);
  myGUI.add(go, "ga", 0, 1, 0.01);
  myGUI.add(randadd, "add").name("Randomize");
  myGUI.add(go, "tool", ["None", "Draw", "Erase"]);
  myGUI.add(go, "fill");
  myGUI.add(go, "mirror").listen();
  myGUI.add(go, "saveme").name("Save me").listen();
  myGUI.add(go, "getme").name("Get me");
  var dn = myGUI.addFolder("Danger");
  dn.add(gebut, "getb").name("Get now");
  dn.add(clearbut, "clr").name("Clear all");
}

/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
//consts
const DEFAULT_SIZE = 1000;

//globals
var cx, cy; //circle center
var rectradi; //main square radius
var pstroke, pfill, pwidth; //pencil lines
var chinw, chinh, chinp, chinxl, chinxc, chinxr, chinlength; //chin line width, cpoint height, height, left, center, right points, chin distance down
var jawpoint, jawtop; //jawpoint is where circle and rect intersect, jawtop-jaw meets ears
var mouthw, mouthh;
var curve_tightness, num_circles, num_slices;
var tmpl1point, tmpl2left, tmpl2right, tmpl3left, tmpl3right, earendh, earendw;
var curves = [];
var manualCurve0 = [];
var manualCurve1 = [];
var activePt = -1; //which index is touched by the mouse
///global radius and angle to animate points
var go; //gui options
var myGUI = new dat.GUI();

function setup() {
  tWIDTH = window.innerWidth;
  tHEIGHT = window.innerHeight;
  DIM = min(tWIDTH, tHEIGHT);
  Md = DIM / DEFAULT_SIZE;
  createCanvas(DIM, DIM);
  cx = cy = DIM / 2;

  angleMode(DEGREES);

  //starting values
  ppw = 6; //pencil point width in pixels
  curve_tightness = 0.0;
  num_circles = 12;
  num_slices = 24;

  //GUI stuff
  addGUI();
  loadCurves();
}

function draw() {
  background(250);
  tint(255, 100);
  //image(img, 0, 0, DIM, DIM);
  drawAll();

  drawManual();
  prt_eyes();
  //drawHelperLines(true);
  /*
  drawCurve(prt_bhair());
  drawCurve(prt_bhair(), 0, 0, true);  
  drawCurve(prt_thair());
  drawCurve(prt_thair(), 0, 0, true);

  drawCurve(prt_ear());
  drawCurve(prt_ear(), 0, 0, true);
  drawCurve(prt_jaw());
  drawCurve(prt_jaw(), 0, 0, true);
  drawCurve(prt_bmth());
  drawCurve(prt_bmth(), 0, 0, true);
  drawCurve(prt_mmth());
  drawCurve(prt_mmth(), 0, 0, true);
  drawCurve(prt_tmth());
  drawCurve(prt_tmth(), 0, 0, true);
  drawCurve(prt_teye());
  drawCurve(prt_teye(), 0, 0, true);
  drawCurve(prt_beye());
  drawCurve(prt_beye(), 0, 0, true);
  drawCurve(prt_tbro());
  drawCurve(prt_tbro(), 0, 0, true);
  drawCurve(prt_bbro());
  drawCurve(prt_bbro(), 0, 0, true);
  drawCurve(prt_nos1());
  drawCurve(prt_nos1(), 0, 0, true);
  drawCurve(prt_nos2());
  drawCurve(prt_nos2(), 0, 0, true);
  drawCurve(prt_nose());
  drawCurve(prt_nose(), 0, 0, true);
  prt_eyes();*/

  //noLoop();
}
