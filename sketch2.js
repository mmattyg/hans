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

let seed = parseInt(tokenData.hash.slice(0, 16), 16);
let R = new NewRandom(seed);

//get circle-line intersection points
intersectLineCircle = function (p1, p2, cpt, r) {
  let sign = function (x) {
    return x < 0.0 ? -1 : 1;
  };
  let x1 = p1.copy().sub(cpt);
  let x2 = p2.copy().sub(cpt);
  let dv = x2.copy().sub(x1);
  let dr = dv.mag();
  let D = x1.x * x2.y - x2.x * x1.y;
  // evaluate if there is an intersection
  let di = r * r * dr * dr - D * D;
  if (di < 0.0) return [];
  let t = sqrt(di);
  ip = [];
  ip.push(new p5.Vector(D * dv.y + sign(dv.y) * dv.x * t, -D * dv.x + p.abs(dv.y) * t).div(dr * dr).add(cpt));
  if (di > 0.0) {
    ip.push(new p5.Vector(D * dv.y - sign(dv.y) * dv.x * t, -D * dv.x - p.abs(dv.y) * t).div(dr * dr).add(cpt));
  }
  return ip;
};

function drawHelperLines(drawit) {
  rectradi = (radi / 4) * 3; //main square radius
  chinh = cy + rectradi * 2;
  chinxc = cx;
  chinxl = cx - chinw * rectradi;
  chinxr = cx + chinw * rectradi;

  //actually draw it?
  if (drawit) {
    fill(pfill);
    stroke(pstroke);
    strokeWeight(pwidth);
    rectMode(CENTER);
    circle(cx, cy, radi * 2); //main circle
    rect(cx, cy, rectradi * 2, rectradi * 2); //main square
    //chin points
    circle(chinxc, chinh, 5);
    circle(chinxl, chinh, 5);
    circle(chinxr, chinh, 5);
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
var chinw, chinh, chinxl, chinxc, chinxr; //chin line width, height, left, center, right points

function setup() {
  tWIDTH = window.innerWidth;
  tHEIGHT = window.innerHeight;
  DIM = min(tWIDTH, tHEIGHT);
  Md = DIM / DEFAULT_SIZE;
  createCanvas(DIM, DIM);
  cx = cy = DIM / 2;

  //starting values
  radi = DIM * 0.3;
  pstroke = color(0, 0, 255, 30); //pencil stroke
  pfill = color(0, 10); //pencil fill
  pwidth = 1; //pencil stroke weight
  chinw = 0.1; //chin bottom line, in radi units

  //GUI stuff
  gui = createGui("control");
  sliderRange(1, DIM, 1);
  gui.addGlobals("cx", "cy", "radi");
  sliderRange(0, 1, 0.02);
  gui.addGlobals("chinw");
}

function draw() {
  background(250);
  drawHelperLines(true);
}
