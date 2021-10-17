/* eslint no-unused-vars: "off", no-undef: "off", array-element-newline: "never",array-bracket-newline: "never" */
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
tokenData = { hash: random_hash() };
//fixed hash:
//tokenData = { hash: "0x55ac46671239943c1111410215501820fc414444fff3495bf77aeed734446666" };
//tokenData = { hash: "0x6666667676767676767676767676767676767676767676767676767676767676" };
//tokenData = { hash: "0x6666667676712344321654321654321654321654321654767676763216543216" };
let hash = tokenData.hash;

let seed = parseInt(tokenData.hash.slice(2, 10), 16);
let R = new NewRandom(seed);

function c2p(r, theta) {
  let x = r * cos(theta);
  let y = r * sin(theta);
  return [x, y];
}
function drawCurve(pts, offsetx = 0, offsety = 0, mirror = false) {
  push();
  translate(cx, cy);
  noFill();
  stroke(30);
  strokeWeight(2);
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
    circle(pts[i][0] + offsetx, pts[i][1] + offsety, ppw);
  }
  pop();
}

//top of skull
function prt_top() {
  let crv = [];
  crv.push(c2p((radi * 28) / 32, 180));
  crv.push(c2p((radi * 28) / 32, 188));
  crv.push(c2p((radi * 28.7) / 32, 195));
  crv.push(c2p((radi * 31) / 32, 210));
  for (var i = 225; i <= 315; i += 15) {
    crv.push(c2p(radi, i));
  }
  crv.push(c2p((radi * 31) / 32, 330));
  crv.push(c2p((radi * 28.7) / 32, 345));
  crv.push(c2p((radi * 28) / 32, 353));
  crv.push(c2p((radi * 28) / 32, 360));
  return crv;
}
//jaw part
function prt_jaw() {
  let crv = [];
  crv.push(c2p((radi * 28) / 32, 20));
  crv.push(c2p((radi * 28) / 32, 30));
  crv.push(c2p((radi * 32) / 32, 45));
  crv.push(c2p((radi * 36) / 32, 55));
  crv.push(c2p((radi * 40) / 32, 65));
  crv.push(c2p((radi * 44) / 32, 75));

  crv.push(c2p((radi * 44) / 32, 90));

  crv.push(c2p((radi * 44) / 32, 105));
  crv.push(c2p((radi * 40) / 32, 115));
  crv.push(c2p((radi * 36) / 32, 125));
  crv.push(c2p((radi * 32) / 32, 135));
  crv.push(c2p((radi * 28) / 32, 150));
  crv.push(c2p((radi * 28) / 32, 160));
  return crv;
}

//mouth part
function prt_mth() {
  let crv = [];
  crv.push(c2p((radi * 32) / 32, 50));
  crv.push(c2p((radi * 32) / 32, 75));
  crv.push(c2p((radi * 32) / 32, 90));
  crv.push(c2p((radi * 32) / 32, 105));
  crv.push(c2p((radi * 32) / 32, 120));
  return crv;
}

//eyes
function prt_eyes() {
  //anchor pupils, left and right
  let rc = c2p((radi * 12) / 32, 0);
  let lc = c2p((radi * 12) / 32, 180);

  push();
  translate(cx, cy);
  fill(0);
  //pupils
  circle(rc[0], rc[1], radi / 25);
  circle(lc[0], lc[1], radi / 25);
  //iris
  noFill();
  stroke(30);
  strokeWeight(2);
  arc(rc[0], rc[1], radi / 7, radi / 7, -80, 80);
  arc(rc[0], rc[1], radi / 7, radi / 7, 100, 260);
  arc(lc[0], lc[1], radi / 7, radi / 7, -80, 80);
  arc(lc[0], lc[1], radi / 7, radi / 7, 100, 260);
  pop();

  let crv = []; //top arc
  crv.push([rc[0] - radi / 6, rc[1]]);
  crv.push([rc[0] - radi / 6, rc[1]]);
  crv.push([rc[0] - radi / 9, rc[1] - radi / 22]);
  crv.push([rc[0], rc[1] - radi / 14]); //top
  crv.push([rc[0] + radi / 9, rc[1] - radi / 22]);
  crv.push([rc[0] + radi / 6.2, rc[1]]);
  crv.push([rc[0] + radi / 6.2, rc[1]]);
  drawCurve(crv);
  drawCurve(crv, 0, 0, true);

  crv = []; //bottom arc
  crv.push([rc[0] - radi / 6.5, rc[1]]);
  crv.push([rc[0] - radi / 6.5, rc[1]]);
  crv.push([rc[0] - radi / 9, rc[1] + radi / 32]);
  crv.push([rc[0], rc[1] + radi / 20]); //bottom
  crv.push([rc[0] + radi / 9, rc[1] + radi / 42]);
  crv.push([rc[0] + radi / 6.2, rc[1] - radi / 32]);
  crv.push([rc[0] + radi / 6.2, rc[1] - radi / 32]);
  drawCurve(crv, 0, radi / 32);
  drawCurve(crv, 0, radi / 32, true);
}

//draw helper lines
function drawHelperLines() {
  stroke(0, 0, 255, 30);
  fill(0, 10);
  strokeWeight(1);
  rectMode(CENTER);
  circle(cx, cy, radi * 2); //main circle
  //helper circles, from radius 0 to radi*1.5
  for (var ci = 1; ci <= num_circles; ci++) {
    noFill();
    circle(cx, cy, (ci * (radi * 3)) / num_circles);
    fill(0, 10);
    textSize(8);
    text(ci * 4, cx + (ci * (radi * 1.5)) / num_circles - 10, cy);
  }
  //helper slices
  for (var ci = 0; ci < num_slices; ci++) {
    let angle = ci * (360 / num_slices);
    tx = cos(angle) * radi * 1.5;
    ty = sin(angle) * radi * 1.5;
    line(cx, cy, cx + tx, cy + ty);
    textSize(9);
    text(angle, cx + tx + 5, cy + ty + 5);
  }
}

/*******************************************************************************/
/*******************************************************************************/
/*******************************************************************************/
//consts
const DEFAULT_SIZE = 1000;

//globals
var cx, cy; //circle center
var radi; //circle radius
var rectradi; //main square radius
var pstroke, pfill, pwidth; //pencil lines
var chinw, chinh, chinp, chinxl, chinxc, chinxr, chinlength; //chin line width, cpoint height, height, left, center, right points, chin distance down
var jawpoint, jawtop; //jawpoint is where circle and rect intersect, jawtop-jaw meets ears
var mouthw, mouthh;
var curve_tightness, num_circles, num_slices;
var tmpl1point, tmpl2left, tmpl2right, tmpl3left, tmpl3right, earendh, earendw;

function setup() {
  tWIDTH = window.innerWidth;
  tHEIGHT = window.innerHeight;
  DIM = min(tWIDTH, tHEIGHT);
  Md = DIM / DEFAULT_SIZE;
  createCanvas(DIM, DIM);
  cx = cy = DIM / 2;

  angleMode(DEGREES);

  //starting values
  radi = DIM * 0.3;
  ppw = 6; //pencil point width in pixels
  curve_tightness = 0.0;
  num_circles = 12;
  num_slices = 24;

  //GUI stuff
  gui = createGui("control");
  sliderRange(1, DIM, 1);
  gui.addGlobals("radi");
}

function draw() {
  background(250);
  drawHelperLines(true);
  drawCurve(prt_top());
  drawCurve(prt_jaw());
  drawCurve(prt_mth());
  prt_eyes();
}
