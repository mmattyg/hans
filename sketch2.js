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
  ip.push(new p5.Vector(D * dv.y + sign(dv.y) * dv.x * t, -D * dv.x + abs(dv.y) * t).div(dr * dr).add(cpt));
  if (di > 0.0) {
    ip.push(new p5.Vector(D * dv.y - sign(dv.y) * dv.x * t, -D * dv.x - abs(dv.y) * t).div(dr * dr).add(cpt));
  }
  return ip;
};

//calculate helper lines, and maybe drawem too
function drawHelperLines(drawit) {
  rectradi = (radi / 4) * 3; //main square radius
  chinh = cy + rectradi * chinlength;
  chinxc = cx;
  chinxl = cx - chinw * rectradi;
  chinxr = cx + chinw * rectradi;
  //bottom line intersection with circle
  let p1 = new p5.Vector(cx - rectradi, cy + rectradi);
  let p2 = new p5.Vector(cx + rectradi, cy + rectradi);
  let cpt = new p5.Vector(cx, cy);
  jawpoint = intersectLineCircle(p1, p2, cpt, radi);
  //temple points intersections, top and a little below top
  p1 = new p5.Vector(cx - rectradi, cy - rectradi);
  p2 = new p5.Vector(cx + rectradi, cy - rectradi);
  tmpl1point = intersectLineCircle(p1, p2, cpt, radi);
  p1 = new p5.Vector(cx - rectradi, cy - rectradi);
  p2 = new p5.Vector(cx - rectradi, cy);
  tmpl2left = intersectLineCircle(p1, p2, cpt, radi);
  p1 = new p5.Vector(cx + rectradi, cy - rectradi);
  p2 = new p5.Vector(cx + rectradi, cy);
  tmpl2right = intersectLineCircle(p1, p2, cpt, radi);
  p1 = new p5.Vector(cx - rectradi - earendw * radi, cy - rectradi);
  p2 = new p5.Vector(cx - rectradi - earendw * radi, cy);
  tmpl3left = intersectLineCircle(p1, p2, cpt, radi);
  p1 = new p5.Vector(cx + rectradi + earendw * radi, cy - rectradi);
  p2 = new p5.Vector(cx + rectradi + earendw * radi, cy);
  tmpl3right = intersectLineCircle(p1, p2, cpt, radi);

  //actually draw it?
  if (drawit) {
    fill(pfill);
    stroke(pstroke);
    strokeWeight(pwidth);
    rectMode(CENTER);
    circle(cx, cy, radi * 2); //main circle
    //helper circles, from radius 0 to radi*1.5
    for (var ci = 1; ci <= num_circles; ci++) {
      noFill();
      circle(cx, cy, (ci * (radi * 3)) / num_circles);
      fill(pfill);
      textSize(8);
      text(ci, cx + (ci * (radi * 1.5)) / num_circles - 10, cy);
    }
    //helper slices
    for (var ci = 1; ci <= num_slices; ci++) {
      let angle = (ci - 1) * (360 / num_slices) + 270;
      tx = cos(radians(angle)) * radi * 1.5;
      ty = sin(radians(angle)) * radi * 1.5;
      line(cx, cy, cx + tx, cy + ty);
      textSize(8);
      text(ci, cx + tx + 5, cy + ty + 5);
    }
    line(cx - radi, cy, cx + radi, cy);
    line(cx, cy - radi, cx, cy + radi);
    rect(cx, cy, rectradi * 2, rectradi * 2); //main square
    //chin points
    circle(chinxl, chinh, ppw);
    circle(chinxc, chinh + chinp * radi, ppw);
    circle(chinxr, chinh, ppw);
    //jaw points, right then left
    circle(jawpoint[0].x, jawpoint[0].y, ppw);
    circle(jawpoint[1].x, jawpoint[1].y, ppw);
    //temple points
    circle(cx, cy - radi, ppw);
    circle(tmpl1point[0].x, tmpl1point[0].y, ppw);
    circle(tmpl1point[1].x, tmpl1point[1].y, ppw);
    circle(tmpl2left[1].x, tmpl2left[1].y, ppw);
    circle(tmpl2right[1].x, tmpl2right[1].y, ppw);
    circle(tmpl3left[1].x, tmpl3left[1].y, ppw);
    circle(tmpl3right[1].x, tmpl3right[1].y, ppw);
  }
}

//draw actual face lines
function drawActual() {
  curveTightness(curve_tightness);
  //fill(rfill);
  noFill();
  stroke(rstroke);
  strokeWeight(rwidth);
  //jawline
  beginShape();
  curveVertex(cx - rectradi, cy + jawtop * rectradi - 0.1 * rectradi);
  curveVertex(cx - rectradi, cy + jawtop * rectradi);
  curveVertex(jawpoint[1].x, jawpoint[1].y);
  curveVertex(chinxl, chinh);
  curveVertex(chinxc, chinh + chinp * radi);
  curveVertex(chinxr, chinh);
  curveVertex(jawpoint[0].x, jawpoint[0].y);
  curveVertex(cx + rectradi, cy + jawtop * rectradi);
  curveVertex(cx + rectradi, cy + jawtop * rectradi - 0.1 * rectradi);
  endShape();
  //center mouth
  beginShape();
  vertex(cx - mouthw * radi, cy + radi);
  curveVertex(cx - mouthw * radi, cy + radi);
  curveVertex(cx, cy + (1 + mouthh) * radi);
  curveVertex(cx + mouthw * radi, cy + radi);
  vertex(cx + mouthw * radi, cy + radi);
  endShape();
  //top skull
  beginShape();
  vertex(cx - rectradi - earendw * radi, cy - earendh * radi * 1.1);
  curveVertex(cx - rectradi - earendw * radi, cy - earendh * radi);
  curveVertex(tmpl3left[1].x, tmpl3left[1].y);
  curveVertex(tmpl2left[1].x, tmpl2left[1].y);
  curveVertex(tmpl1point[1].x, tmpl1point[1].y, ppw);
  curveVertex(cx, cy - radi);
  curveVertex(tmpl1point[0].x, tmpl1point[0].y, ppw);
  curveVertex(tmpl2right[1].x, tmpl2right[1].y, ppw);
  curveVertex(tmpl3right[1].x, tmpl3right[1].y);
  curveVertex(cx + rectradi + earendw * radi, cy - earendh * radi);
  vertex(cx + rectradi + earendw * radi, cy - earendh * radi);
  endShape();
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

  //starting values
  radi = DIM * 0.3;
  pstroke = color(0, 0, 255, 30); //pencil stroke
  pfill = color(0, 10); //pencil fill
  pwidth = 1; //pencil stroke weight
  rstroke = color(30); //real stroke
  rfill = color(0, 30); //real fill
  rwidth = 2; //real stroke weight
  chinw = 0.4; //chin line, in radi units
  chinp = 0.07; //chin point height, in radi units
  chinlength = 1.71; // chin distance from center in radi
  mouthw = 0.17;
  mouthh = 0.01;
  jawtop = 0.5;
  earendh = 0.1;
  earendw = 0.1;
  ppw = 10; //pencil point width in pixels
  curve_tightness = 0.0;
  num_circles = 12;
  num_slices = 24;

  //GUI stuff
  gui = createGui("control");
  sliderRange(1, DIM, 1);
  gui.addGlobals("radi");
  sliderRange(1, 24, 1);
  gui.addGlobals("num_circles");
  sliderRange(1, 36, 1);
  gui.addGlobals("num_slices");
  sliderRange(0, 1, 0.01);
  gui.addGlobals("chinw", "jawtop");
  sliderRange(1.5, 2.5, 0.01);
  gui.addGlobals("chinlength");
  sliderRange(-1.5, 1.5, 0.01);
  gui.addGlobals("chinlength", "chinp", "mouthw", "mouthh", "earendh", "earendw");
  sliderRange(-5, 5, 0.01);
  gui.addGlobals("curve_tightness");
}

function draw() {
  background(250);
  drawHelperLines(true);
  drawActual();
}
