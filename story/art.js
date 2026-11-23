/* Drawn pictures for the storybook. Every picture is a 120 × 120 SVG built from a small kit of shapes,
   so they share one style: thick round ink outlines, flat fills, a soft ground shadow.
   Fill classes: fa (page colour), fb (pale page colour), fw (paper), fk (ink) and natural colours
   (wood, stone, leaf, fire, flame, water, metal, gold, copper, iron, red, sky, earth, night, clay, sand, cloth). */
window.ART = (function () {
  'use strict';
  var PI = Math.PI;
  function r2(v) { return Math.round(v * 100) / 100; }
  function P(d, c) { return '<path class="f ' + (c || 'fw') + '" d="' + d + '"/>'; }
  function L(d, c) { return '<path class="ln' + (c ? ' ' + c : '') + '" d="' + d + '"/>'; }
  function C(x, y, r, c) { return '<circle class="f ' + (c || 'fw') + '" cx="' + r2(x) + '" cy="' + r2(y) + '" r="' + r2(r) + '"/>'; }
  function E(x, y, rx, ry, c) { return '<ellipse class="f ' + (c || 'fw') + '" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function R(x, y, w, h, rx, c) { return '<rect class="f ' + (c || 'fw') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '"/>'; }
  function T(x, y, txt, size) { return '<text class="tx" x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + (size || 14) + '">' + txt + '</text>'; }
  function S(d, color, w) { return '<path class="ln" style="stroke:var(--' + color + ')' + (w ? ';stroke-width:calc(var(--sw,2.6)*' + w + ')' : '') + '" d="' + d + '"/>'; }
  // place a drawing: translate, then rotate (degrees), then scale; keeps line widths even when scaled
  function at(x, y, s, inner, rot) {
    s = s || 1;
    var t = 'translate(' + r2(x) + ' ' + r2(y) + ')' + (rot ? ' rotate(' + rot + ')' : '') + (s !== 1 ? ' scale(' + s + ')' : '');
    return '<g transform="' + t + '"' + (s !== 1 ? ' style="--sw:' + r2(2.6 / s) + '"' : '') + '>' + inner + '</g>';
  }
  function grp(cls, inner) { return '<g class="' + cls + '">' + inner + '</g>'; }
  function sh(cx, cy, rx) { return '<ellipse class="fb nos" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + r2(rx * 0.16) + '"/>'; }
  function poly(pts) { return 'M' + pts.map(function (p) { return r2(p[0]) + ' ' + r2(p[1]); }).join(' L') + 'Z'; }
  function night() { return R(8, 8, 104, 104, 22, 'night'); }

  /* ---------- nature ---------- */
  function flame(x, y, s) {
    return at(x, y, s, P('M0 0 C-16 0 -20 -14 -13 -25 C-9 -31 -7 -36 -4 -46 C4 -38 8 -32 7 -26 C11 -29 13 -33 13 -37 C21 -27 22 -12 14 -5 C11 -2 6 0 0 0Z', 'fire') +
      P('M0 0 C-8 0 -10 -8 -6 -14 C-4 -17 -2 -20 -1 -26 C4 -20 8 -14 7 -8 C7 -3 4 0 0 0Z', 'flame'));
  }
  function logs(x, y, s) {
    return at(x, y, s, P('M-26 -3 L22 -15 L25 -7 L-23 5Z', 'wood') + P('M26 -3 L-22 -15 L-25 -7 L23 5Z', 'wood') + E(-24, 1, 3, 4, 'sand') + E(24, 1, 3, 4, 'sand'));
  }
  function campfire(x, y, s) { return at(x, y, s, sh(0, 4, 34) + logs(0, 0, 1) + flame(0, -6, 1.05)); }
  function stone(x, y, s, c) { return at(x, y, s, P('M-22 0 L-26 -12 L-16 -24 L2 -28 L18 -22 L26 -8 L20 0Z', c || 'stone')); }
  function sun(x, y, r) {
    var rays = '';
    for (var i = 0; i < 8; i++) {
      var a = i * PI / 4;
      rays += 'M' + r2(x + Math.cos(a) * (r + 5)) + ' ' + r2(y + Math.sin(a) * (r + 5)) + ' L' + r2(x + Math.cos(a) * (r + 11)) + ' ' + r2(y + Math.sin(a) * (r + 11)) + ' ';
    }
    return L(rays) + C(x, y, r, 'gold');
  }
  function moon(x, y, r, c) {
    return P('M' + x + ' ' + (y - r) + ' A' + r + ' ' + r + ' 0 0 0 ' + x + ' ' + (y + r) + ' A' + r2(r * 0.55) + ' ' + r + ' 0 0 1 ' + x + ' ' + (y - r) + 'Z', c || 'gold');
  }
  function star(x, y, r, c) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = -PI / 2 + i * PI / 5, rr = i % 2 ? r * 0.45 : r;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    return P(poly(pts), c || 'gold');
  }
  function sparkle(x, y, r) { return L('M' + x + ' ' + (y - r) + ' L' + x + ' ' + (y + r) + ' M' + (x - r) + ' ' + y + ' L' + (x + r) + ' ' + y, 'th'); }
  function cloud(x, y, s, c) {
    return at(x, y, s, P('M-22 0 C-30 0 -30 -12 -21 -12 C-20 -22 -6 -24 -2 -16 C2 -24 16 -22 16 -12 C26 -13 28 0 20 0Z', c || 'fw'));
  }
  function puff(x, y, s) { return cloud(x, y, s, 'cloth'); }
  function water(x0, x1, y, c) {
    var d = 'M' + x0 + ' ' + y, w = (x1 - x0) / 6;
    for (var i = 0; i < 6; i++) d += ' q' + r2(w / 2) + ' -5 ' + r2(w) + ' 0';
    return P(d + ' L' + x1 + ' 112 L' + x0 + ' 112Z', c || 'water');
  }
  function ground(y, c) { return P('M8 ' + y + ' C30 ' + (y - 5) + ' 90 ' + (y - 5) + ' 112 ' + y + ' L112 112 L8 112Z', c || 'earth'); }
  function wheat(x, y, s) {
    var g = '';
    for (var i = 0; i < 5; i++) g += E(-4, -30 - i * 7, 3.2, 5.5, 'gold') + E(4, -33 - i * 7, 3.2, 5.5, 'gold');
    return at(x, y, s, L('M0 0 L0 -64') + L('M0 -10 C-6 -14 -10 -14 -14 -12', 'th') + g + E(0, -68, 3, 6, 'gold'));
  }
  function sprout(x, y, s) {
    return at(x, y, s, L('M0 0 L0 -18') + P('M0 -14 C-4 -24 -14 -26 -18 -22 C-14 -14 -6 -12 0 -14Z', 'leaf') + P('M0 -18 C4 -28 14 -30 18 -26 C14 -18 6 -16 0 -18Z', 'leaf'));
  }
  function tree(x, y, s) { return at(x, y, s, P('M-4 0 L-3 -26 L3 -26 L4 0Z', 'wood') + C(-12, -30, 10, 'leaf') + C(12, -30, 10, 'leaf') + C(0, -42, 16, 'leaf')); }
  function palm(x, y, s) {
    return at(x, y, s, P('M-3 0 C-2 -20 2 -34 6 -46 L10 -45 C6 -32 3 -18 4 0Z', 'wood') +
      P('M8 -46 C0 -56 -14 -54 -20 -44 C-10 -50 0 -48 8 -46Z', 'leaf') + P('M8 -46 C14 -58 28 -56 32 -46 C22 -51 14 -49 8 -46Z', 'leaf') + P('M8 -46 C4 -60 10 -66 16 -66 C12 -58 11 -52 8 -46Z', 'leaf'));
  }
  function leaf(x, y, s, rot) { return at(x, y, s, P('M0 0 C-8 -10 -6 -26 0 -32 C6 -26 8 -10 0 0Z', 'leaf') + L('M0 -2 L0 -26', 'th'), rot); }
  function island(x, y, s) { return at(x, y, s, P('M-34 0 C-24 -14 24 -14 34 0Z', 'sand') + palm(4, -8, 0.8)); }
  function drop(x, y, s, c) { return at(x, y, s, P('M0 -22 C6 -12 10 -6 10 0 C10 6 5 10 0 10 C-5 10 -10 6 -10 0 C-10 -6 -6 -12 0 -22Z', c || 'water')); }
  function bubbles(x, y) { return C(x, y, 3, 'fw') + C(x + 6, y - 8, 2.2, 'fw') + C(x - 3, y - 14, 1.8, 'fw'); }
  function steam(x, y, s) { return at(x, y, s, L('M-8 0 C-12 -6 -4 -10 -8 -16 M0 -2 C-4 -8 4 -12 0 -18 M8 0 C4 -6 12 -10 8 -16', 'th')); }
  function bison(x, y, s, c) {
    return at(x, y, s, P('M-30 0 L-28 -14 C-30 -24 -22 -32 -10 -30 C-2 -40 14 -40 20 -30 C28 -30 34 -22 30 -12 L30 0 L24 0 L22 -10 L-8 -10 L-12 0 L-18 0 L-20 -10Z', (c || 'red') + ' nos'));
  }

  /* ---------- people and animals ---------- */
  function person(x, y, s, c, arms, extra) {
    arms = arms || 'M-11 -40 L-19 -22 M11 -40 L19 -22';
    return at(x, y, s, L('M-6 -16 L-8 0 M6 -16 L8 0') + L(arms) + P('M-11 -42 C-6 -45 6 -45 11 -42 L13 -16 L-13 -16Z', c || 'fa') + C(0, -53, 8, 'fw') + (extra || ''));
  }
  function child(x, y, s, c, arms) { return person(x, y, s || 0.7, c, arms); }
  function handShape(c) {
    return R(-12, -46, 5.6, 26, 2.8, c) + R(-5.6, -50, 5.6, 30, 2.8, c) + R(0.8, -48, 5.6, 28, 2.8, c) + R(7.2, -42, 5.6, 22, 2.8, c) +
      at(-10, -12, 1, R(-3, -20, 6, 20, 3, c), -42) + R(-12.5, -28, 25, 28, 9, c);
  }
  function hand(x, y, s, c, rot) { return at(x, y, s, handShape(c || 'sand'), rot); }
  function stencil(x, y, s, rot) { return at(x, y, s, handShape('red nos') + R(-8, -6, 16, 12, 3, 'red nos'), rot); }
  function dog(x, y, s, c) {
    c = c || 'sand';
    return at(x, y, s, L('M-12 -16 L-13 0 M-4 -16 L-4 0 M8 -16 L8 0 M15 -16 L16 0') + L('M-18 -27 C-25 -31 -27 -38 -23 -43') +
      E(0, -23, 20, 10, c) + P('M10 -26 L16 -40 L28 -40 L36 -34 L35 -28 L22 -27Z', c) + P('M15 -38 L17 -48 L23 -40Z', 'fk') + C(24, -35, 1.6, 'fk') + C(35.5, -32, 1.8, 'fk'));
  }
  function cat(x, y, s, c) {
    c = c || 'cloth';
    return at(x, y, s, L('M13 -4 C26 -4 30 -18 23 -26') + P('M-14 0 C-18 -14 -13 -27 0 -29 C13 -27 18 -14 14 0Z', c) +
      P('M-10 -40 L-10 -56 L-2 -48Z', c) + P('M10 -40 L10 -56 L2 -48Z', c) + C(0, -40, 11, c) +
      C(-4, -42, 1.6, 'fk') + C(4, -42, 1.6, 'fk') + P('M-1.5 -37.5 L1.5 -37.5 L0 -35.5Z', 'fk') + L('M-6 -36 L-16 -38 M-6 -34 L-16 -32 M6 -36 L16 -38 M6 -34 L16 -32', 'th'));
  }
  function cow(x, y, s, c) {
    c = c || 'fw';
    return at(x, y, s, L('M-18 -18 L-18 0 M-10 -18 L-10 0 M10 -18 L10 0 M17 -18 L17 0') + L('M-26 -32 C-32 -28 -32 -18 -30 -12') +
      R(-27, -38, 50, 24, 10, c) + E(-8, -28, 6, 5, 'fk') + E(10, -32, 4, 3.5, 'fk') +
      L('M22 -44 C20 -50 24 -54 28 -52 M34 -44 C36 -50 32 -54 28 -54') + R(20, -46, 16, 20, 7, c) + E(28, -28, 8, 5, 'clay') + C(25, -38, 1.6, 'fk') + C(31, -38, 1.6, 'fk'));
  }
  function horse(x, y, s, c) {
    c = c || 'wood';
    return at(x, y, s, L('M-18 -20 L-20 0 M-10 -20 L-10 0 M12 -20 L12 0 M19 -20 L21 0') + P('M-24 -30 C-32 -26 -34 -14 -30 -6 C-28 -14 -26 -22 -22 -26Z', 'fk') +
      E(-2, -28, 24, 11, c) + P('M14 -34 L22 -54 L28 -56 L38 -46 L35 -41 L27 -44 L22 -28Z', c) + P('M16 -36 L22 -56 L26 -56 L20 -36Z', 'fk') + C(29, -49, 1.6, 'fk'));
  }
  function sheep(x, y, s) {
    return at(x, y, s, L('M-10 -10 L-10 0 M-2 -10 L-2 0 M8 -10 L8 0 M14 -10 L14 0') +
      P('M-18 -14 C-24 -14 -24 -24 -18 -25 C-18 -34 -8 -36 -4 -31 C0 -38 12 -37 13 -30 C20 -32 24 -24 19 -19 C22 -12 14 -8 10 -11 C6 -6 -2 -7 -4 -11 C-8 -7 -16 -8 -18 -14Z', 'fw') +
      E(22, -26, 6, 8, 'fk') + E(16, -31, 4, 2, 'fk'));
  }
  function chicken(x, y, s) {
    return at(x, y, s, L('M-2 -10 L-4 0 L-8 0 M-4 0 L0 0 M6 -10 L6 0 L2 0 M6 0 L10 0') +
      P('M-20 -30 C-24 -38 -18 -44 -14 -36 C-16 -44 -8 -44 -10 -34Z', 'fk') +
      P('M-18 -30 C-18 -16 -6 -8 6 -10 C18 -12 20 -26 14 -34 C12 -38 12 -42 10 -46 L4 -46 C2 -38 -6 -30 -18 -30Z', 'fw') +
      P('M6 -46 C6 -52 10 -53 11 -48 C13 -52 16 -50 14 -46Z', 'red') + P('M12 -42 L18 -40 L12 -38Z', 'gold') + C(9, -42, 1.4, 'fk') +
      P('M-4 -26 C2 -24 6 -20 6 -16 C0 -16 -6 -20 -4 -26Z', 'cloth'));
  }
  function fish(x, y, s, c, rot) {
    return at(x, y, s, P('M-14 0 L-26 -9 L-24 0 L-26 9Z', c || 'water') + P('M-18 0 C-8 -11 10 -11 18 0 C10 11 -8 11 -18 0Z', c || 'water') + C(10, -2, 1.8, 'fk'), rot);
  }
  function bird(x, y, s) { return at(x, y, s, L('M-10 0 C-6 -6 -2 -6 0 0 C2 -6 6 -6 10 0')); }

  /* ---------- buildings ---------- */
  function hut(x, y, s) {
    return at(x, y, s, P('M-30 0 C-30 -40 30 -40 30 0Z', 'wood') + L('M-22 -16 C-14 -26 -4 -30 6 -30 M-12 -4 C-4 -16 10 -24 22 -18 M-28 -6 L28 -6', 'th') + P('M-8 0 C-8 -14 8 -14 8 0Z', 'fk'));
  }
  function roundhouse(x, y, s, c) {
    return at(x, y, s, R(-20, -22, 40, 22, 2, c || 'clay') + P('M-26 -20 L0 -46 L26 -20Z', 'sand') + L('M-14 -26 L0 -40 L14 -26', 'th') + P('M-6 0 L-6 -12 C-6 -16 6 -16 6 -12 L6 0Z', 'fk'));
  }
  function house(x, y, s, wall, roof) {
    return at(x, y, s, R(-20, -26, 40, 26, 1, wall || 'fw') + P('M-26 -24 L0 -46 L26 -24Z', roof || 'red') + R(-5, -14, 10, 14, 1, 'fk') + R(8, -20, 8, 8, 1, 'sky'));
  }
  function flatHouse(x, y, s, wall) {
    return at(x, y, s, R(-16, -26, 32, 26, 1, wall || 'sand') + R(-18, -30, 36, 5, 1, 'wood') + R(-4, -12, 8, 12, 1, 'fk') + R(6, -20, 6, 6, 1, 'fk'));
  }
  function bricks(x, y, s, c) {
    var b = '';
    for (var r = 0; r < 4; r++) for (var i = 0; i < 3 - (r % 2); i++) b += R(-36 + (r % 2) * 12 + i * 24, -12 - r * 12, 24, 12, 1, c || 'clay');
    return at(x, y, s, b);
  }
  function temple(x, y, s, c) {
    var cols = '';
    for (var i = 0; i < 5; i++) cols += R(-30 + i * 14, -40, 6, 32, 1, c || 'fw');
    return at(x, y, s, R(-38, -8, 76, 8, 1, c || 'fw') + cols + R(-38, -46, 76, 7, 1, c || 'fw') + P('M-40 -46 L0 -64 L40 -46Z', c || 'fw'));
  }
  function ziggurat(x, y, s) {
    return at(x, y, s, R(-40, -16, 80, 16, 1, 'sand') + R(-30, -30, 60, 14, 1, 'sand') + R(-20, -44, 40, 14, 1, 'sand') + R(-10, -56, 20, 12, 1, 'clay') +
      P('M-4 0 L-4 -44 L4 -44 L4 0Z', 'wood') + L('M-4 -8 L4 -8 M-4 -16 L4 -16 M-4 -24 L4 -24 M-4 -32 L4 -32 M-4 -40 L4 -40', 'th'));
  }
  function factory(x, y, s) {
    return at(x, y, s, cloud(26, -68, 0.55, 'cloth') + cloud(8, -60, 0.4, 'cloth') + R(18, -62, 10, 46, 1, 'clay') + R(4, -54, 10, 38, 1, 'clay') +
      P('M-38 0 L-38 -22 L-24 -34 L-24 -22 L-10 -34 L-10 -22 L4 -34 L4 -22 L34 -22 L34 0Z', 'clay') +
      R(-30, -14, 8, 7, 1, 'gold') + R(-16, -14, 8, 7, 1, 'gold') + R(-2, -14, 8, 7, 1, 'gold') + R(14, -14, 14, 14, 1, 'fk'));
  }
  function arch(x, y, s, c) { return at(x, y, s, P('M-22 0 L-22 -30 C-22 -46 22 -46 22 -30 L22 0 L12 0 L12 -28 C12 -38 -12 -38 -12 -28 L-12 0Z', c || 'stone')); }

  /* ---------- tools and things ---------- */
  function handaxe(x, y, s, rot) {
    return at(x, y, s, P('M0 -52 C10 -40 20 -20 18 -6 C16 2 -16 2 -18 -6 C-20 -20 -10 -40 0 -52Z', 'stone') + L('M0 -44 L-6 -30 L4 -20 L-4 -8 M8 -34 L4 -20 L12 -10 M-12 -20 L-4 -8', 'th'), rot);
  }
  function core(x, y, s) { return at(x, y, s, stone(0, 0, 1) + L('M-16 -24 L-6 -10 L2 -28 M-6 -10 L18 -22 M-6 -10 L-22 0 M-6 -10 L8 0', 'th')); }
  function flake(x, y, s, rot) { return at(x, y, s, P('M0 0 L-9 -8 L-8 -24 L2 -30 L10 -18 L8 -6Z', 'stone') + L('M-2 -26 L0 -6', 'th'), rot); }
  function blade(x, y, s, rot) { return at(x, y, s, P('M0 0 L-6 -6 L-5 -42 L0 -52 L5 -42 L6 -6Z', 'stone') + L('M0 -46 L0 -6', 'th'), rot); }
  function spear(x, y, len, rot, tip) { return at(x, y, 1, R(-len, -2.5, len, 5, 2.5, 'wood') + P('M-2 -5 L18 0 L-2 5Z', tip || 'stone') + L('M-6 -4 L-2 4 M-2 -4 L-6 4', 'th'), rot); }
  function arrow(x, y, len, rot) {
    return at(x, y, 1, L('M' + (-len) + ' 0 L0 0') + P('M0 -4 L12 0 L0 4Z', 'stone') + P('M' + (-len) + ' 0 L' + (-len - 6) + ' -6 L' + (-len + 6) + ' -6 L' + (-len + 10) + ' 0Z', 'red'), rot);
  }
  function bone(x, y, s, rot) { return at(x, y, s, P('M-30 -6 C-36 -12 -30 -20 -24 -14 C-22 -20 -12 -18 -16 -10 L26 -4 L-16 0 C-12 6 -22 8 -24 2 C-30 8 -36 0 -30 -6Z', 'cloth'), rot); }
  function needle(x, y, s, rot) { return at(x, y, s, P('M-34 -3 C-34 -6 -30 -6 -26 -5 L34 0 L-26 5 C-30 6 -34 6 -34 3Z', 'cloth') + E(-28, 0, 3, 1.5, 'fk'), rot); }
  function rope(x, y, s) {
    return at(x, y, s, L('M24 -8 C40 -4 44 6 36 12') + E(0, -14, 30, 14, 'sand') + E(0, -14, 22, 9, 'sand') + E(0, -14, 14, 5, 'sand') + E(0, -14, 6, 2, 'fk') +
      L('M-24 -20 L-20 -10 M-10 -26 L-8 -16 M6 -27 L4 -17 M20 -24 L16 -14', 'th'));
  }
  function pot(x, y, s, c) { return at(x, y, s, P('M-14 -38 L14 -38 L12 -32 C26 -24 26 -4 12 0 L-12 0 C-26 -4 -26 -24 -12 -32Z', c || 'clay') + L('M-18 -20 C-6 -16 6 -16 18 -20', 'th')); }
  function jar(x, y, s, c) { return at(x, y, s, P('M-9 -52 L9 -52 L8 -44 C22 -36 22 -8 8 0 L-8 0 C-22 -8 -22 -36 -8 -44Z', c || 'clay') + L('M-9 -44 C-16 -44 -18 -36 -14 -32 M9 -44 C16 -44 18 -36 14 -32', 'th')); }
  function bowl(x, y, s, c) { return at(x, y, s, P('M-22 -16 L22 -16 C22 -4 12 0 0 0 C-12 0 -22 -4 -22 -16Z', c || 'clay')); }
  function wheel(x, y, r, c) {
    var sp = '';
    for (var i = 0; i < 6; i++) { var a = i * PI / 3; sp += 'M' + x + ' ' + y + ' L' + r2(x + Math.cos(a) * r * 0.78) + ' ' + r2(y + Math.sin(a) * r * 0.78) + ' '; }
    return C(x, y, r, c || 'wood') + C(x, y, r * 0.78, 'fw') + L(sp) + C(x, y, r * 0.2, c || 'wood');
  }
  function solidWheel(x, y, r) {
    return C(x, y, r, 'wood') + L('M' + r2(x - r * 0.9) + ' ' + r2(y - r * 0.3) + ' L' + r2(x + r * 0.9) + ' ' + r2(y - r * 0.3) + ' M' + r2(x - r * 0.9) + ' ' + r2(y + r * 0.3) + ' L' + r2(x + r * 0.9) + ' ' + r2(y + r * 0.3), 'th') + C(x, y, r * 0.22, 'fk');
  }
  function gear(x, y, r, n, c) {
    var pts = [], k = n * 4;
    for (var i = 0; i < k; i++) {
      var a = (i - 0.5) * 2 * PI / k, rr = (i % 4 < 2) ? r : r * 0.78;
      pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    return P(poly(pts), c || 'metal') + C(x, y, r * 0.3, 'fw');
  }
  function hammer(x, y, s, rot) { return at(x, y, s, R(-3, -6, 6, 44, 3, 'wood') + R(-14, -16, 28, 12, 3, 'iron'), rot); }
  function anvil(x, y, s) { return at(x, y, s, P('M-30 -30 L22 -30 C30 -30 34 -26 36 -22 L14 -22 L10 -14 L16 0 L-16 0 L-10 -14 L-16 -22 L-30 -22Z', 'iron')); }
  function ingot(x, y, s, c) { return at(x, y, s, P('M-20 0 L-14 -12 L14 -12 L20 0Z', c || 'copper')); }
  function axe(x, y, s, c, rot) { return at(x, y, s, R(-3, -50, 6, 52, 3, 'wood') + P('M2 -48 C14 -50 22 -46 24 -36 C22 -28 14 -26 2 -30Z', c || 'copper'), rot); }
  function sword(x, y, s, c, rot) {
    return at(x, y, s, P('M-3 -20 L-4 -72 L0 -80 L4 -72 L3 -20Z', c || 'metal') + R(-12, -22, 24, 5, 2, 'gold') + R(-2.5, -17, 5, 14, 2, 'wood') + C(0, -2, 3.5, 'gold'), rot);
  }

  /* ---------- writing and ideas ---------- */
  function tablet(x, y, s) {
    var m = '';
    for (var r = 0; r < 5; r++) for (var i = 0; i < 4; i++) m += 'M' + (-15 + i * 10 + (r % 2) * 3) + ' ' + (-46 + r * 9) + ' l5 2 l-5 2z ';
    return at(x, y, s, R(-24, -54, 48, 54, 8, 'clay') + L(m, 'th'));
  }
  function book(x, y, s, c) {
    return at(x, y, s, P('M0 -6 C-12 -12 -26 -12 -36 -8 L-36 -46 C-26 -50 -12 -50 0 -44Z', 'fw') + P('M0 -6 C12 -12 26 -12 36 -8 L36 -46 C26 -50 12 -50 0 -44Z', 'fw') +
      P('M-36 -8 L-36 -2 C-26 -6 -12 -6 0 0 C12 -6 26 -6 36 -2 L36 -8 C26 -12 12 -12 0 -6 C-12 -12 -26 -12 -36 -8Z', c || 'fa') +
      L('M-28 -38 L-8 -36 M-28 -30 L-8 -28 M-28 -22 L-12 -20 M8 -36 L28 -38 M8 -28 L28 -30 M8 -20 L24 -22', 'th'));
  }
  function envelope(x, y, s) { return at(x, y, s, R(-30, -40, 60, 40, 3, 'fw') + L('M-30 -40 L0 -16 L30 -40') + R(14, -36, 12, 14, 1, 'red')); }
  function coin(x, y, r, c) { return C(x, y, r, c || 'gold') + C(x, y, r * 0.72, c || 'gold'); }
  function speech(x, y, s, c) { return at(x, y, s, P('M-26 -36 C-26 -46 26 -46 26 -36 L26 -14 C26 -6 20 -6 12 -6 L4 -6 L-6 4 L-4 -6 L-18 -6 C-24 -6 -26 -8 -26 -14Z', c || 'fw')); }
  function heart(x, y, s, c) { return at(x, y, s, P('M0 0 C-4 -4 -14 -10 -14 -18 C-14 -26 -4 -26 0 -19 C4 -26 14 -26 14 -18 C14 -10 4 -4 0 0Z', c || 'red')); }
  function brain(x, y, s, c) {
    return at(x, y, s, P('M-30 -4 C-40 -6 -42 -20 -34 -26 C-36 -38 -24 -46 -14 -42 C-10 -52 6 -52 10 -44 C20 -50 34 -42 32 -30 C42 -26 40 -10 30 -8 C28 0 18 2 12 -2 L10 8 L2 8 L2 -2 C-8 4 -24 4 -30 -4Z', c || 'fb') +
      L('M-24 -28 C-18 -32 -14 -26 -18 -20 C-20 -14 -12 -10 -8 -14 M-4 -42 C-6 -34 2 -32 4 -26 C6 -20 14 -22 16 -28 M22 -34 C18 -26 26 -20 22 -14 M-20 -10 C-14 -6 -6 -8 0 -10', 'th'));
  }
  function globe(x, y, r) {
    var k = r / 40;
    return C(x, y, r, 'water') + at(x, y, k, P('M-30 -22 c8 -6 18 -4 20 4 c2 8 10 8 8 16 c-2 8 -12 6 -14 0 c-2 -6 -12 -4 -14 -10 c-1 -4 0 -8 0 -10z', 'leaf') +
      P('M6 -26 c10 -4 22 2 22 12 c0 8 -10 10 -12 18 c-2 10 -14 8 -12 -2 c2 -8 -6 -12 -4 -20 c1 -4 3 -7 6 -8z', 'leaf') + P('M-14 18 c6 -2 14 2 12 10 c-2 4 -10 4 -12 -2z', 'leaf'));
  }
  function bulb(x, y, s, lit) {
    return at(x, y, s, (lit ? L('M-28 -50 L-36 -54 M28 -50 L36 -54 M0 -80 L0 -88 M-22 -70 L-28 -76 M22 -70 L28 -76') : '') +
      P('M-10 -14 C-10 -26 -22 -32 -22 -48 C-22 -62 -12 -72 0 -72 C12 -72 22 -62 22 -48 C22 -32 10 -26 10 -14Z', lit ? 'flame' : 'fw') +
      L('M-6 -26 L-4 -40 L0 -34 L4 -40 L6 -26', 'th') + R(-10, -14, 20, 12, 3, 'metal') + L('M-10 -9 L10 -9', 'th') + P('M-5 -2 L5 -2 L2 2 L-2 2Z', 'fk'));
  }
  function bolt(x, y, s, c) { return at(x, y, s, P('M4 -46 L-14 -18 L-2 -18 L-6 2 L14 -28 L2 -28Z', c || 'flame')); }
  function phone(x, y, s, scr) { return at(x, y, s, R(-16, -60, 32, 60, 6, 'fk') + R(-12, -54, 24, 46, 2, 'sky') + (scr || '') + C(0, -4, 2, 'fw')); }
  function screen(x, y, s, inner) { return at(x, y, s, P('M-8 -14 L8 -14 L12 0 L-12 0Z', 'metal') + R(-36, -60, 72, 46, 4, 'fk') + R(-31, -55, 62, 36, 1, 'sky') + (inner || '')); }
  function satellite(x, y, s, rot) {
    return at(x, y, s, R(-36, -6, 22, 12, 1, 'water') + R(14, -6, 22, 12, 1, 'water') + L('M-14 0 L14 0') + R(-8, -10, 16, 20, 3, 'gold') + L('M0 10 L0 16') + C(0, 18, 2.5, 'fw') +
      L('M-30 -6 L-30 6 M-22 -6 L-22 6 M22 -6 L22 6 M30 -6 L30 6', 'th'), rot);
  }
  function rocket(x, y, s, rot) {
    return at(x, y, s, P('M-8 -4 C-10 6 -4 14 0 20 C4 14 10 6 8 -4Z', 'fire') + P('M-12 -14 L-22 2 L-10 -2Z', 'red') + P('M12 -14 L22 2 L10 -2Z', 'red') +
      P('M-12 -2 L-12 -40 C-12 -54 0 -66 0 -66 C0 -66 12 -54 12 -40 L12 -2Z', 'fw') + C(0, -34, 5, 'sky') + R(-12, -10, 24, 4, 1, 'red'), rot);
  }
  function car(x, y, s, c) {
    return at(x, y, s, P('M-40 -8 L-40 -22 L-26 -24 L-16 -38 L16 -38 L26 -24 L40 -22 L42 -8Z', c || 'fa') + P('M-12 -34 L-4 -34 L-4 -24 L-20 -24Z', 'sky') + P('M2 -34 L14 -34 L20 -24 L2 -24Z', 'sky') +
      C(-24, -8, 9, 'fk') + C(-24, -8, 4, 'metal') + C(24, -8, 9, 'fk') + C(24, -8, 4, 'metal'));
  }
  function oldCar(x, y, s, c) {
    return at(x, y, s, P('M-24 -26 L-24 -48 L4 -48 L4 -26Z', 'fw') + L('M-28 -50 L8 -50') + R(-36, -26, 70, 14, 3, c || 'fa') +
      R(8, -34, 26, 8, 2, c || 'fa') + C(36, -22, 3, 'gold') + wheel(-22, -10, 12, 'fk') + wheel(22, -10, 12, 'fk'));
  }
  function train(x, y, s) {
    return at(x, y, s, cloud(-30, -54, 0.5, 'cloth') + cloud(-46, -64, 0.4, 'cloth') + R(-32, -42, 8, 12, 1, 'fk') + R(-36, -46, 16, 5, 1, 'fk') +
      R(-40, -30, 44, 22, 4, 'fa') + R(4, -46, 28, 38, 2, 'fa') + R(10, -40, 16, 12, 1, 'sky') +
      P('M-46 -8 L-40 -24 L-40 -8Z', 'red') + R(-44, -10, 80, 4, 1, 'fk') + C(-28, -4, 7, 'fk') + C(-10, -4, 7, 'fk') + C(16, -4, 9, 'fk'));
  }
  function boat(x, y, s, c) {
    return at(x, y, s, P('M-40 -14 C-30 -2 30 -2 40 -14 C38 -8 32 0 20 0 L-20 0 C-32 0 -38 -8 -40 -14Z', c || 'wood') + P('M-40 -14 C-30 -8 30 -8 40 -14 C30 -10 -30 -10 -40 -14Z', 'fk'));
  }
  function sailboat(x, y, s, c) {
    return at(x, y, s, L('M0 -16 L0 -78') + P('M2 -74 C22 -60 26 -36 22 -22 L2 -22Z', c || 'cloth') + P('M-2 -66 C-18 -54 -20 -34 -18 -22 L-2 -22Z', c || 'cloth') +
      P('M0 -78 L12 -74 L0 -70Z', 'red') + P('M-36 -16 L36 -16 L26 0 L-26 0Z', 'wood'));
  }
  function bicycle(x, y, s) {
    return at(x, y, s, C(-24, -16, 16, 'fw') + C(24, -16, 16, 'fw') + C(-24, -16, 3, 'fk') + C(24, -16, 3, 'fk') +
      L('M-24 -16 L-6 -16 L12 -38 L-12 -38 L-24 -16 M-6 -16 L-14 -44 M12 -38 L24 -16 M12 -38 L10 -48 L18 -50 M-20 -46 L-8 -46') + C(-6, -16, 4, 'fw'));
  }
  function cart(x, y, s, c) { return at(x, y, s, L('M16 -24 L44 -20') + R(-34, -36, 50, 18, 2, c || 'wood') + solidWheel(-10, -14, 14)); }
  function compass(x, y, r) {
    return C(x, y, r, 'gold') + C(x, y, r * 0.8, 'fw') + P('M' + x + ' ' + (y - r * 0.7) + ' L' + (x + 6) + ' ' + y + ' L' + (x - 6) + ' ' + y + 'Z', 'red') +
      P('M' + x + ' ' + (y + r * 0.7) + ' L' + (x + 6) + ' ' + y + ' L' + (x - 6) + ' ' + y + 'Z', 'metal') + C(x, y, 2.5, 'fk') + T(x, y - r * 0.8 + 14, 'N', 11);
  }
  function clockFace(x, y, r, h, m) {
    var ticks = '';
    for (var i = 0; i < 12; i++) { var a = i * PI / 6; ticks += 'M' + r2(x + Math.cos(a) * r * 0.72) + ' ' + r2(y + Math.sin(a) * r * 0.72) + ' L' + r2(x + Math.cos(a) * r * 0.86) + ' ' + r2(y + Math.sin(a) * r * 0.86) + ' '; }
    var ha = ((h || 10) % 12) / 12 * 2 * PI - PI / 2, ma = (m || 10) / 60 * 2 * PI - PI / 2;
    return C(x, y, r, 'fw') + L(ticks, 'th') + L('M' + x + ' ' + y + ' L' + r2(x + Math.cos(ha) * r * 0.45) + ' ' + r2(y + Math.sin(ha) * r * 0.45) + ' M' + x + ' ' + y + ' L' + r2(x + Math.cos(ma) * r * 0.66) + ' ' + r2(y + Math.sin(ma) * r * 0.66)) + C(x, y, 2.5, 'fk');
  }
  function syringe(x, y, s, rot) {
    return at(x, y, s, L('M22 0 L38 0') + R(-34, -3, 10, 6, 1, 'metal') + R(-38, -9, 4, 18, 1, 'metal') + R(-24, -6, 40, 12, 2, 'fw') + R(-24, -4, 22, 8, 1, 'fa') + R(16, -2, 6, 4, 1, 'metal') +
      L('M-10 -6 L-10 -2 M-2 -6 L-2 -2 M6 -6 L6 -2', 'th'), rot);
  }
  function pill(x, y, s, rot) { return at(x, y, s, R(-24, -10, 48, 20, 10, 'fw') + P('M0 -10 L-14 -10 C-20 -10 -24 -6 -24 0 C-24 6 -20 10 -14 10 L0 10Z', 'fa'), rot); }
  function dna(x, y, s, rot) {
    var a = '', b = '', rungs = '';
    for (var i = 0; i <= 24; i++) {
      var t = i / 24, yy = -64 + t * 64, xx = Math.sin(t * 2.5 * PI) * 15;
      a += (i ? ' L' : 'M') + r2(xx) + ' ' + r2(yy); b += (i ? ' L' : 'M') + r2(-xx) + ' ' + r2(yy);
      if (i % 2 === 1) rungs += 'M' + r2(xx) + ' ' + r2(yy) + ' L' + r2(-xx) + ' ' + r2(yy) + ' ';
    }
    return at(x, y, s, L(rungs, 'th') + L(a) + S(a, 'c', 1) + L(b) + S(b, 'water', 1), rot);
  }
  function atom(x, y, r) {
    var e = function (rot) { return '<ellipse class="ln" cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + r2(r * 0.36) + '"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + '/>'; };
    return e(0) + e(60) + e(-60) + C(x, y, r * 0.2, 'red');
  }
  function germ(x, y, r, c) {
    var sp = '';
    for (var i = 0; i < 8; i++) { var a = i * PI / 4; sp += 'M' + r2(x + Math.cos(a) * r) + ' ' + r2(y + Math.sin(a) * r) + ' L' + r2(x + Math.cos(a) * (r + 5)) + ' ' + r2(y + Math.sin(a) * (r + 5)) + ' '; }
    return L(sp, 'th') + C(x, y, r, c || 'leaf') + C(x - r * 0.3, y - r * 0.2, r * 0.18, 'fk') + C(x + r * 0.3, y - r * 0.2, r * 0.18, 'fk');
  }
  function chip(x, y, s) {
    var legs = '';
    for (var i = 0; i < 4; i++) {
      var k = -15 + i * 10;
      legs += 'M' + k + ' -26 L' + k + ' -36 M' + k + ' 26 L' + k + ' 36 M-26 ' + k + ' L-36 ' + k + ' M26 ' + k + ' L36 ' + k + ' ';
    }
    return at(x, y, s, L(legs) + R(-26, -26, 52, 52, 5, 'fk') + R(-16, -16, 32, 32, 3, 'fa'));
  }
  function pylon(x, y, s) {
    return at(x, y, s, L('M-14 0 L-4 -64 L4 -64 L14 0 M-10 -26 L10 -26 M-7 -46 L7 -46 M-12 -12 L10 -26 M12 -12 L-10 -26 M-9 -28 L7 -46 M9 -28 L-7 -46 M-24 -52 L24 -52 M-18 -62 L18 -62') +
      C(-24, -48, 2, 'fk') + C(24, -48, 2, 'fk') + C(-18, -58, 2, 'fk') + C(18, -58, 2, 'fk'));
  }
  function turbine(x, y, s) {
    var b = P('M0 0 C-4 -12 -3 -34 0 -40 C4 -34 5 -12 0 0Z', 'fw');
    return at(x, y, s, P('M-3 0 L-2 -66 L2 -66 L3 0Z', 'fw') + at(0, -68, 1, b, 0) + at(0, -68, 1, b, 120) + at(0, -68, 1, b, 240) + C(0, -68, 4, 'metal'));
  }
  function panel(x, y, s) {
    return at(x, y, s, L('M0 -14 L0 0 M-12 0 L12 0') + P('M-34 -14 L34 -14 L26 -42 L-26 -42Z', 'night') + S('M-9 -42 L-11 -14 M9 -42 L11 -14 M-30 -28 L30 -28', 'sky', 0.6));
  }
  function tap(x, y, s) {
    return at(x, y, s, R(-40, -50, 12, 20, 2, 'metal') + P('M-28 -46 L8 -46 C16 -46 20 -40 20 -32 L20 -26 L10 -26 L10 -32 C10 -35 8 -36 6 -36 L-28 -36Z', 'metal') + R(-12, -56, 8, 10, 1, 'metal') + R(-20, -60, 24, 5, 2, 'red'));
  }
  function bottle(x, y, s, c) { return at(x, y, s, P('M-6 -56 L6 -56 L6 -46 C14 -40 14 -34 14 -28 L14 -4 C14 -1 12 0 10 0 L-10 0 C-12 0 -14 -1 -14 -4 L-14 -28 C-14 -34 -14 -40 -6 -46Z', c || 'water') + R(-7, -62, 14, 7, 2, 'red')); }
  function can(x, y, s) { return at(x, y, s, R(-18, -44, 36, 44, 4, 'metal') + R(-18, -34, 36, 22, 1, 'red') + E(0, -44, 18, 4, 'metal') + fish(0, -23, 0.45, 'fw')); }
  function mug(x, y, s, c) { return at(x, y, s, L('M14 -30 C26 -30 26 -12 14 -12') + P('M-16 -38 L16 -38 L14 -4 C14 -1 12 0 10 0 L-10 0 C-12 0 -14 -1 -14 -4Z', c || 'fw') + E(0, -38, 16, 3.5, 'earth')); }
  function crown(x, y, s) { return at(x, y, s, P('M-26 0 L-30 -30 L-14 -16 L0 -36 L14 -16 L30 -30 L26 0Z', 'gold') + C(0, -12, 4, 'red') + C(-15, -8, 3, 'water') + C(15, -8, 3, 'water')); }
  function scales(x, y, s) {
    return at(x, y, s, R(-3, -60, 6, 56, 2, 'gold') + R(-18, -6, 36, 6, 2, 'gold') + L('M-34 -54 L34 -54 M-34 -54 L-44 -30 M-34 -54 L-24 -30 M34 -54 L24 -30 M34 -54 L44 -30') +
      P('M-46 -30 L-22 -30 C-22 -22 -46 -22 -46 -30Z', 'gold') + P('M22 -30 L46 -30 C46 -22 22 -22 22 -30Z', 'gold') + C(0, -62, 4, 'gold'));
  }
  function kiln(x, y, s) { return at(x, y, s, P('M-30 0 L-30 -26 C-30 -48 30 -48 30 -26 L30 0Z', 'clay') + P('M-12 0 L-12 -12 C-12 -20 12 -20 12 -12 L12 0Z', 'fk') + flame(0, -1, 0.35)); }
  function loom(x, y, s) {
    var warp = '';
    for (var i = 0; i < 7; i++) warp += 'M' + (-18 + i * 6) + ' -56 L' + (-18 + i * 6) + ' -10 ';
    return at(x, y, s, L(warp, 'th') + R(-26, -48, 52, 30, 1, 'fa') + L('M-26 -40 L26 -40 M-26 -32 L26 -32 M-26 -24 L26 -24', 'th') +
      R(-30, -62, 6, 62, 2, 'wood') + R(24, -62, 6, 62, 2, 'wood') + R(-30, -62, 60, 6, 2, 'wood') + R(-30, -16, 60, 6, 2, 'wood'));
  }
  function spool(x, y, s, c) { return at(x, y, s, R(-9, -30, 18, 24, 1, c || 'fa') + L('M-9 -24 L9 -22 M-9 -16 L9 -14', 'th') + R(-12, -36, 24, 6, 2, 'wood') + R(-12, -6, 24, 6, 2, 'wood')); }
  var CAVE = 'M10 34 C10 18 22 10 40 10 L84 10 C102 10 112 22 112 40 L112 96 C112 106 104 112 94 112 L24 112 C14 112 8 104 8 94Z';

  /* ---------- pictures, by page id ---------- */
  var A = {};
  // chapter 1
  A['stone-tools'] = function () { return sh(60, 98, 42) + core(46, 96, 1.2) + flake(90, 98, 1.1, 20) + L('M70 50 L76 44 M76 58 L84 56 M66 42 L66 34', 'th'); };
  A.homo = function () { return sh(60, 104, 40) + person(50, 104, 1.3, 'earth', 'M-11 -40 L-20 -24 M11 -40 L24 -30') + handaxe(84, 70, 0.4, 30) + L('M94 34 L100 28 M98 44 L106 42', 'th'); };
  A['hand-axes'] = function () { return sh(60, 102, 36) + handaxe(60, 100, 1.45); };
  A['bone-tools'] = function () { return sh(60, 100, 42) + bone(58, 78, 1.35, -14) + needle(66, 100, 0.6, -6); };
  A.fire = function () { return campfire(60, 98, 1.3) + sparkle(28, 32, 4) + sparkle(94, 26, 3) + sparkle(84, 44, 2.5); };
  A.cooking = function () { return campfire(60, 102, 1.05) + L('M18 42 L104 58') + E(62, 50, 16, 9, 'clay') + E(62, 48, 9, 4, 'earth') + steam(62, 36, 0.7); };
  A.spears = function () { return sh(60, 104, 46) + spear(88, 30, 84, -45) + spear(100, 64, 84, -22); };
  A.shelters = function () { return sh(60, 102, 50) + tree(20, 100, 0.65) + hut(64, 100, 1.4); };
  A['fire-making'] = function () { return sh(60, 104, 44) + stone(40, 94, 0.85, 'iron') + stone(82, 72, 0.7) + C(56, 66, 3, 'flame') + C(62, 58, 2, 'flame') + C(48, 60, 2.2, 'flame') + L('M58 54 L56 46 M66 66 L74 66 M44 70 L38 68', 'th') + E(88, 104, 18, 4, 'sand') + flame(88, 102, 0.3); };
  A.levallois = function () { return sh(60, 102, 44) + at(46, 100, 1.1, P('M-28 0 C-30 -18 -14 -30 4 -30 C20 -28 30 -16 28 0Z', 'stone') + P('M-14 -6 C-16 -18 -4 -24 6 -22 C14 -20 18 -12 14 -4Z', 'sand') + L('M-14 -6 L-4 -14 L6 -22 M-4 -14 L14 -4', 'th')) + flake(94, 70, 1, 30) + L('M80 58 L74 64 M86 50 L84 42', 'th'); };
  // chapter 2
  A.sapiens = function () { return sh(60, 104, 50) + person(36, 104, 1.15, 'clay') + person(68, 104, 1.05, 'fa', 'M-11 -40 L-18 -24 M11 -40 L24 -48') + child(96, 104, 0.7, 'leaf'); };
  A.pigments = function () { return sh(60, 102, 44) + S('M24 40 L44 32 L40 46 L64 36 L58 52 L84 42', 'red', 2.4) + stone(34, 100, 0.8, 'red') + stone(66, 102, 0.55, 'gold') + bowl(92, 102, 0.6, 'red') + sparkle(96, 26, 4); };
  A.barter = function () { return L('M36 30 C50 18 70 18 84 30 M78 24 L84 30 L76 32 M40 82 C54 94 68 94 82 82 M44 90 L40 82 L48 80', 'th') + at(38, 58, 0.9, P('M-14 0 C-14 -18 14 -18 14 0 L0 8Z', 'fw') + L('M-6 -2 L-4 -12 M0 -1 L0 -13 M6 -2 L4 -12', 'th')) + flake(84, 70, 1, 30); };
  A.beads = function () { var b = ''; for (var i = 0; i <= 10; i++) { var a = PI * (0.08 + 0.84 * i / 10); b += C(60 - Math.cos(a) * 38, 34 + Math.sin(a) * 52, 6, i % 2 ? 'fw' : 'fa'); } return L('M22 34 C22 110 98 110 98 34') + b; };
  A.blades = function () { return sh(60, 102, 40) + blade(40, 102, 1.2, -10) + blade(60, 102, 1.35) + blade(80, 102, 1.2, 10); };
  A.bow = function () { return L('M38 18 L38 102', 'th') + S('M38 18 C70 38 70 82 38 102', 'wood', 2.2) + L('M38 18 C70 38 70 82 38 102', 'th') + arrow(102, 60, 72, 0); };
  A.rope = function () { return sh(60, 102, 44) + rope(56, 98, 1.3); };
  A['ground-stone'] = function () { return sh(60, 102, 48) + at(56, 100, 1, P('M-42 0 C-42 -16 42 -16 42 0Z', 'stone')) + E(70, 82, 15, 8, 'stone') + C(30, 92, 2, 'gold') + C(38, 89, 2, 'gold') + C(46, 92, 2, 'gold') + C(52, 89, 2, 'gold'); };
  A.atlatl = function () { return sh(50, 104, 40) + person(30, 104, 1.05, 'clay', 'M-11 -40 L-18 -24 M11 -40 L22 -58') + at(53, 43, 1, R(-2, -2, 26, 4, 2, 'wood'), -28) + spear(100, 26, 62, -30); };
  A['fired-clay'] = function () { return sh(60, 102, 44) + kiln(34, 102, 0.7) + at(80, 100, 1.3, P('M-14 0 C-16 -14 -12 -26 -6 -28 C-8 -36 -2 -40 2 -36 C8 -34 8 -26 6 -22 C14 -18 16 -8 14 0Z', 'clay') + C(1, -32, 1.4, 'fk') + L('M-6 -14 C-2 -10 4 -10 8 -14', 'th')); };
  A.pottery = function () { return sh(60, 104, 38) + pot(60, 102, 1.6, 'clay') + L('M34 62 L40 58 L46 62 L52 58 L58 62 L64 58 L70 62 L76 58 L82 62 L86 60', 'th'); };
  A.art = function () { return P(CAVE, 'stone') + stencil(34, 70, 0.62, -12) + bison(76, 88, 0.85) + L('M54 26 L70 24 M80 32 L96 28', 'th'); };
  A.music = function () { return at(54, 74, 1, R(-44, -6, 84, 12, 6, 'cloth') + C(-24, 0, 2.6, 'fk') + C(-10, 0, 2.6, 'fk') + C(4, 0, 2.6, 'fk') + C(18, 0, 2.6, 'fk'), -24) + L('M84 34 L84 16 L96 13 L96 31') + E(80, 35, 5, 3.6, 'fk') + E(92, 32, 5, 3.6, 'fk') + L('M28 98 L28 84') + E(24, 99, 5, 3.6, 'fk'); };
  A.storytelling = function () { return campfire(60, 106, 0.55) + person(24, 108, 0.8, 'clay', 'M-11 -40 L-18 -24 M11 -40 L22 -54') + child(96, 108, 0.6, 'fa') + speech(60, 64, 1.25) + bison(60, 40, 0.5) + star(80, 28, 4) + moon(40, 30, 5); };
  A['medicinal-plants'] = function () { return sh(60, 104, 44) + leaf(28, 102, 1.3, -14) + leaf(44, 102, 1.05, 16) + R(82, 54, 7, 36, 3.5, 'wood') + bowl(78, 104, 1.15, 'stone') + C(70, 84, 3, 'leaf') + C(86, 86, 3, 'leaf'); };
  A.needles = function () { return L('M34 76 C22 86 28 104 50 98 C70 92 76 106 94 100') + needle(62, 56, 1.4, -32); };
  A.shoes = function () { return sh(60, 100, 46) + at(60, 98, 1.25, P('M-36 0 C-38 -8 -34 -16 -26 -18 L-6 -20 L-2 -32 L14 -32 L16 -18 C30 -16 38 -10 36 0Z', 'earth') + L('M-2 -32 C-4 -24 2 -22 14 -24 M-28 -6 L30 -6 M-14 -14 L-10 -10 M-4 -16 L0 -12', 'th')); };
  A.clothing = function () { return sh(60, 106, 36) + at(60, 104, 1.2, P('M-16 -62 L-32 -48 L-24 -34 L-17 -40 L-19 0 L19 0 L17 -40 L24 -34 L32 -48 L16 -62 C8 -55 -8 -55 -16 -62Z', 'earth') + L('M-19 -6 C-12 -2 -6 -8 0 -4 C6 -8 12 -2 19 -6 M-10 -56 L-8 -46 L8 -46 L10 -56', 'th') + L('M-26 -44 L-22 -40 M26 -44 L22 -40 M-8 -30 L-6 -26 M6 -22 L8 -18', 'th')); };
  A.boats = function () { return water(8, 112, 86) + R(76, 34, 4, 52, 2, 'wood') + E(78, 88, 5, 9, 'wood') + person(50, 76, 0.65, 'clay', 'M-11 -40 L-2 -26 M11 -40 L30 -40') + at(56, 88, 1.25, boat(0, 0, 1)); };
  A.surgery = function () { return sh(60, 104, 46) + at(58, 92, 1.3, P('M-34 -6 C-40 -14 -32 -20 -27 -14 C-24 -20 -14 -16 -18 -8 L18 -8 C14 -16 24 -20 27 -14 C32 -20 40 -14 34 -6 C40 2 32 6 27 2 C24 8 14 4 18 -2 L-18 -2 C-14 4 -24 8 -27 2 C-32 6 -40 2 -34 -6Z', 'cloth') + R(-8, -12, 16, 14, 2, 'fw') + L('M-3 -12 L-3 2 M3 -12 L3 2', 'th')) + leaf(96, 62, 0.8, 40) + leaf(24, 62, 0.7, -40) + flake(60, 54, 0.6, 80); };
  A.querns = function () { return sh(60, 102, 48) + at(54, 100, 1, P('M-42 0 C-42 -14 42 -14 42 0Z', 'stone')) + at(60, 86, 1, P('M-22 0 C-22 -10 22 -10 22 0Z', 'stone')) + C(30, 92, 2, 'gold') + C(86, 91, 2, 'gold') + C(92, 94, 2, 'gold') + wheat(102, 60, 0.4); };
  A['earth-ovens'] = function () { return ground(76, 'earth') + P('M26 76 C26 106 94 106 94 76Z', 'fk') + C(42, 86, 7, 'stone') + C(58, 92, 7, 'stone') + C(76, 88, 7, 'stone') + C(50, 80, 2, 'flame') + P('M30 78 C44 68 76 68 90 78 C76 84 44 84 30 78Z', 'leaf') + steam(60, 58, 1.2); };
  A.fishing = function () { return water(8, 112, 58) + L('M32 8 L32 76 C32 88 48 88 48 76 L44 72') + P('M46 70 L48 76 L42 74Z', 'cloth') + fish(80, 88, 1.1, 'gold') + bubbles(100, 72); };
  A.dogs = function () { return sh(56, 104, 42) + dog(52, 104, 1.45, 'sand') + heart(96, 34, 0.5); };
  A['pot-boiling'] = function () { return campfire(60, 108, 0.8) + pot(60, 86, 1.1, 'clay') + steam(60, 36, 1.1) + bubbles(56, 48); };
  A.lamps = function () { return sh(60, 100, 42) + at(60, 98, 1.2, P('M-30 -14 C-30 -2 -14 2 0 2 C14 2 26 -2 28 -12 L40 -16 L38 -22 L28 -18 C26 -22 -26 -22 -30 -14Z', 'stone') + E(-2, -16, 22, 4, 'earth')) + flame(56, 78, 0.85) + L('M32 30 L26 24 M90 32 L96 26 M60 18 L60 10', 'th'); };
  A.villages = function () { return ground(92, 'leaf') + roundhouse(30, 94, 0.85) + roundhouse(88, 90, 0.75) + roundhouse(60, 108, 0.95) + campfire(24, 110, 0.22); };
  A.bread = function () { return sh(56, 100, 44) + at(54, 96, 1.2, P('M-36 0 C-38 -14 -22 -24 0 -24 C22 -24 38 -14 36 0 C28 4 -28 4 -36 0Z', 'sand') + L('M-20 -16 C-14 -12 -14 -8 -18 -4 M0 -18 C6 -14 6 -8 2 -4 M20 -16 C26 -12 26 -8 22 -4', 'th')) + wheat(102, 100, 0.6); };
  A.fermentation = function () { return sh(56, 104, 36) + jar(52, 102, 1.4, 'clay') + bubbles(50, 26) + wheat(98, 104, 0.6); };
  // chapter 3
  A.farming = function () { return sun(94, 24, 9) + ground(86, 'earth') + L('M10 96 C40 92 80 92 110 96 M10 106 C40 102 80 102 110 106', 'th') + wheat(28, 90, 0.9) + wheat(48, 88, 1.05) + wheat(68, 90, 0.95) + sprout(94, 92, 0.9); };
  A['mud-brick'] = function () { return sh(54, 102, 46) + bricks(54, 102, 1, 'sand') + at(96, 52, 0.7, R(-20, -12, 40, 12, 1, 'wood') + R(-16, -9, 14, 6, 1, 'earth') + R(2, -9, 14, 6, 1, 'earth')) + sun(26, 24, 8); };
  A.wells = function () { return sh(60, 106, 42) + L('M34 70 L34 24 M86 70 L86 24 M28 24 L92 24 M60 24 L60 46') + R(52, 46, 16, 14, 2, 'wood') + water(54, 66, 50) + E(60, 70, 30, 6, 'fk') + R(30, 70, 60, 34, 4, 'stone') + L('M30 81 L90 81 M30 92 L90 92 M44 70 L44 81 M62 81 L62 92 M76 70 L76 81 M50 92 L50 104 M70 92 L70 104', 'th'); };
  A.herding = function () { return ground(96, 'leaf') + sheep(34, 100, 1.05) + sheep(70, 104, 0.95) + L('M110 48 L110 100 M110 48 C110 40 102 40 102 46') + person(96, 100, 0.8, 'clay', 'M-11 -40 L-18 -24 M11 -40 L17 -30'); };
  A.cattle = function () { return sh(56, 104, 46) + cow(54, 104, 1.3); };
  A.copper = function () { return sh(60, 104, 44) + ingot(40, 104, 1.15, 'copper') + axe(80, 104, 1.05, 'copper', 16) + stone(30, 72, 0.45, 'leaf') + sparkle(98, 28, 4); };
  A.cats = function () { return sh(56, 104, 32) + cat(56, 104, 1.25) + C(98, 100, 4.5, 'stone') + L('M102 100 C108 100 110 96 108 93', 'th'); };
  A.moon = function () { return night() + moon(44, 42, 18, 'gold') + C(84, 34, 8, 'gold') + P('M30 80 A8 8 0 0 0 30 96 A4 8 0 0 1 30 80Z', 'gold') + P('M86 74 A8 8 0 0 1 86 90 A4 8 0 0 0 86 74Z', 'gold') + '<circle class="ln th" cx="58" cy="88" r="8"/>' + star(100, 56, 2.5) + star(20, 58, 2.5); };
  A.salt = function () { return sh(56, 102, 46) + at(52, 100, 1, P('M-38 0 C-28 -32 28 -32 38 0Z', 'fw') + L('M-20 -10 L-18 -14 M0 -20 L2 -24 M14 -8 L16 -12', 'th')) + R(28, 56, 8, 8, 1, 'fw') + R(74, 52, 9, 9, 1, 'fw') + R(52, 44, 7, 7, 1, 'fw') + fish(98, 94, 0.5, 'water') + sun(96, 26, 7); };
  A.mirror = function () { return sh(60, 106, 30) + R(54, 82, 12, 24, 3, 'wood') + C(60, 52, 34, 'fk') + C(60, 52, 27, 'night') + L('M42 46 C44 36 52 30 60 30', 'th') + L('M78 56 C76 64 70 70 62 72', 'th') + sparkle(98, 22, 5); };
  A.irrigation = function () { return sun(94, 22, 8) + ground(56, 'leaf') + P('M8 68 C40 74 70 64 112 70 L112 82 C70 76 40 86 8 80Z', 'water') + sprout(24, 58, 0.7) + sprout(48, 56, 0.7) + sprout(72, 56, 0.7) + sprout(96, 58, 0.7) + sprout(30, 106, 0.7) + sprout(60, 104, 0.7) + sprout(90, 106, 0.7); };
  A.dairy = function () { return sh(60, 104, 46) + jar(38, 104, 1, 'fw') + E(38, 52, 8, 2.5, 'fw') + at(84, 104, 1, P('M-22 0 L-22 -16 L22 -28 L22 0Z', 'gold') + C(-10, -8, 3, 'sand') + C(8, -12, 3.5, 'sand') + C(12, -4, 2, 'sand')); };
  A.weaving = function () { return sh(60, 106, 42) + loom(60, 104, 1.2); };
  A['potters-wheel'] = function () { return sh(60, 106, 44) + R(56, 92, 8, 14, 1, 'wood') + E(60, 92, 42, 9, 'wood') + pot(60, 90, 1, 'clay') + hand(26, 72, 0.5, 'sand', 70) + hand(94, 72, 0.5, 'sand', -70); };
  // chapter 4
  A.plow = function () { return ground(80, 'earth') + L('M10 92 C40 88 80 88 110 92 M10 104 C40 100 80 100 110 104', 'th') + at(72, 82, 1, R(-50, -26, 56, 5, 2.5, 'wood') + P('M4 -28 L10 -28 L18 0 L6 4 L0 -2Z', 'wood') + P('M10 0 L26 4 L10 6Z', 'iron') + L('M10 -28 L18 -46 L26 -48'), -4) + cow(22, 80, 0.45); };
  A.cities = function () { return sun(26, 24, 8) + ground(100, 'sand') + ziggurat(78, 100, 0.8) + flatHouse(28, 104, 0.8, 'sand') + flatHouse(50, 106, 0.6, 'clay') + flatHouse(104, 106, 0.5, 'sand') + palm(14, 104, 0.5); };
  A.wheel = function () { return sh(60, 104, 46) + cart(54, 100, 1.15); };
  A['fired-brick'] = function () { return sh(60, 104, 50) + bricks(42, 104, 0.8, 'red') + kiln(92, 104, 0.6) + puff(92, 60, 0.4); };
  A.writing = function () { return sh(56, 106, 38) + tablet(50, 104, 1.35) + at(96, 54, 1, R(-3, -4, 6, 40, 3, 'wood') + P('M-3 -4 L3 -4 L0 -12Z', 'wood'), 20); };
  A.bronze = function () { return sh(60, 106, 46) + ingot(62, 106, 0.6, 'gold') + sword(38, 104, 1.05, 'gold', -16) + axe(86, 104, 1, 'gold', 12); };
  A.sail = function () { return water(8, 112, 92) + sailboat(56, 94, 1.05, 'cloth') + bird(92, 28, 0.8) + bird(104, 38, 0.6); };
  A.seasons = function () { return C(60, 60, 46, 'fw') + P('M60 60 L60 14 A46 46 0 0 1 106 60Z', 'leaf') + P('M60 60 L106 60 A46 46 0 0 1 60 106Z', 'gold') + P('M60 60 L60 106 A46 46 0 0 1 14 60Z', 'clay') + P('M60 60 L14 60 A46 46 0 0 1 60 14Z', 'sky') + sprout(80, 50, 0.6) + sun(80, 80, 5) + leaf(42, 92, 0.55, -40) + star(40, 40, 7, 'fw') + C(60, 60, 5, 'fk'); };
  A.states = function () { return sh(60, 104, 46) + crown(60, 50, 1.1) + R(26, 72, 68, 30, 3, 'fw') + L('M34 81 L86 81 M34 90 L78 90', 'th') + coin(98, 96, 9); };
  A.glass = function () { return sh(60, 106, 42) + at(46, 106, 1.25, P('M-8 -54 L8 -54 L6 -44 C18 -36 18 -10 12 0 L-12 0 C-18 -10 -18 -36 -6 -44Z', 'sky') + L('M-10 -34 C-6 -28 -6 -18 -10 -10', 'th')) + C(92, 96, 6, 'water') + C(80, 100, 5, 'leaf') + C(100, 104, 4.5, 'gold') + sparkle(90, 44, 6); };
  A.sewers = function () { return flatHouse(32, 40, 0.6) + flatHouse(88, 40, 0.6) + R(8, 40, 104, 8, 1, 'stone') + P('M8 48 L112 48 L112 112 L8 112Z', 'earth') + P('M18 112 L18 84 C18 64 102 64 102 84 L102 112Z', 'fk') + P('M26 112 L26 86 C26 72 94 72 94 86 L94 112Z', 'stone') + water(26, 94, 100, 'earth') + L('M60 48 L60 70'); };
  A.schools = function () { return sh(60, 106, 46) + tablet(38, 104, 0.95) + child(84, 106, 1, 'fa', 'M-11 -40 L-18 -24 M11 -40 L-8 -30') + T(88, 30, 'A B C', 14); };
  A.soap = function () { return sh(56, 102, 42) + at(52, 102, 1, P('M-30 -4 L-28 -24 C-28 -28 -24 -30 -20 -30 L22 -30 C26 -30 28 -28 28 -24 L30 -4 C30 0 26 0 22 0 L-22 0 C-26 0 -30 0 -30 -4Z', 'fb')) + C(84, 52, 11, 'fw') + C(62, 40, 7, 'fw') + C(94, 26, 6, 'fw') + C(38, 54, 5, 'fw') + L('M78 48 C80 45 85 45 88 47', 'th'); };
  A.roads = function () { return sun(94, 24, 8) + P('M8 70 C40 64 80 64 112 70 L112 112 L8 112Z', 'leaf') + P('M52 66 L68 66 L100 112 L20 112Z', 'stone') + L('M58 74 L62 74 M54 84 L66 84 M48 96 L72 96 M40 108 L80 108', 'th') + tree(22, 72, 0.5) + R(90, 62, 10, 26, 3, 'fw') + T(95, 80, 'X', 10); };
  A.contracts = function () { return sh(60, 106, 44) + tablet(42, 104, 1) + C(84, 86, 14, 'red') + C(84, 86, 8, 'red') + L('M79 86 L89 86 M84 81 L84 91', 'th'); };
  A.horses = function () { return sh(56, 106, 46) + horse(56, 106, 1.35); };
  A['star-time'] = function () { return night() + star(86, 26, 7, 'fw') + sparkle(86, 26, 14) + star(40, 22, 3) + star(62, 36, 2.5) + star(102, 50, 2.5) + P('M16 100 L42 56 L68 100Z', 'sand') + P('M58 100 L80 68 L102 100Z', 'sand') + water(8, 112, 100); };
  A.laws = function () { return sh(54, 106, 40) + at(50, 106, 1.25, P('M-24 0 L-24 -60 C-24 -74 24 -74 24 -60 L24 0Z', 'stone') + C(0, -56, 8, 'fb') + L('M-14 -38 L14 -38 M-14 -30 L14 -30 M-14 -22 L14 -22 M-14 -14 L10 -14 M-14 -6 L14 -6', 'th')) + scales(98, 66, 0.45); };
  A.pulleys = function () { return L('M10 14 L110 14') + R(54, 14, 4, 12, 1, 'wood') + L('M44 36 L44 98 M68 36 L68 72') + C(56, 36, 12, 'wood') + C(56, 36, 3, 'fk') + sh(68, 102, 22) + R(56, 72, 24, 26, 2, 'stone') + hand(44, 112, 0.42, 'sand', 0); };
  A.iron = function () { return sh(56, 106, 46) + anvil(52, 106, 1.25) + hammer(88, 44, 1, -40) + C(46, 62, 2.5, 'flame') + C(56, 54, 2, 'fire') + C(66, 62, 2, 'flame'); };
  A.alphabet = function () { return sh(60, 106, 42) + R(18, 18, 84, 84, 10, 'fw') + at(38, 42, 0.8, P('M-10 -8 L10 -8 L4 12 L-4 12Z', 'sand') + L('M-10 -8 C-18 -10 -20 -18 -16 -22 M10 -8 C18 -10 20 -18 16 -22') + C(-4, 0, 1.6, 'fk') + C(4, 0, 1.6, 'fk')) + T(82, 54, 'A', 30) + at(38, 80, 0.8, R(-12, -10, 24, 22, 1, 'sand') + L('M-12 -10 L-12 12 M-4 12 L-4 2 L4 2 L4 12', 'th')) + T(82, 92, 'B', 30) + L('M54 44 L64 44 M60 40 L64 44 L60 48 M54 82 L64 82 M60 78 L64 82 L60 86', 'th'); };
  A.chickens = function () { return sh(58, 104, 32) + chicken(56, 104, 1.45) + E(98, 100, 5, 6.5, 'cloth'); };
  A.sundials = function () { return sun(102, 22, 7) + sh(60, 104, 46) + E(60, 86, 44, 16, 'stone') + E(60, 82, 44, 16, 'fw') + P('M60 82 L28 74 L30 82Z', 'fk nos') + P('M60 82 L60 42 L84 82Z', 'metal') + L('M22 80 L26 79 M60 68 L60 70 M98 80 L94 79 M38 92 L40 90 M82 92 L80 90', 'th'); };
  A['star-navigation'] = function () { return night() + star(92, 24, 6, 'fw') + star(70, 32, 3) + star(30, 22, 3) + star(100, 50, 2.5) + L('M62 48 L86 30', 'th') + water(8, 112, 92) + sailboat(54, 94, 0.75, 'cloth'); };
  A.aqueducts = function () { return R(8, 42, 104, 70, 2, 'stone') + [0, 1, 2, 3].map(function (i) { var x = 14 + i * 25; return P('M' + x + ' 112 L' + x + ' 76 C' + x + ' 64 ' + (x + 18) + ' 64 ' + (x + 18) + ' 76 L' + (x + 18) + ' 112Z', 'sky'); }).join('') + R(8, 34, 104, 8, 1, 'stone') + R(8, 28, 104, 6, 1, 'water'); };
  A.money = function () { return sh(60, 104, 46) + coin(82, 88, 16, 'metal') + coin(84, 50, 13, 'copper') + coin(44, 64, 24) + at(44, 64, 0.8, P('M-14 6 C-14 -6 -6 -12 4 -10 C10 -14 16 -10 14 -2 C16 4 10 10 0 10 C-6 10 -12 10 -14 6Z', 'gold') + C(4, -2, 1.6, 'fk')); };
  A.democracy = function () { return sh(60, 106, 48) + temple(60, 106, 1.15, 'fw'); };
  A['water-wheel'] = function () { var p = ''; for (var i = 0; i < 8; i++) p += at(50, 56, 1, R(-4, -42, 8, 12, 1, 'wood'), i * 45); return R(84, 30, 28, 68, 2, 'stone') + P('M80 30 L114 30 L97 14Z', 'red') + water(8, 112, 94) + p + wheel(50, 56, 32, 'wood'); };
  A.concrete = function () { return sh(60, 106, 50) + at(60, 106, 1, P('M-40 -38 C-40 -80 40 -80 40 -38Z', 'stone') + C(0, -68, 5, 'sky') + R(-46, -40, 92, 40, 1, 'stone') + R(-34, -34, 12, 34, 1, 'fw') + R(-16, -34, 12, 34, 1, 'fw') + R(4, -34, 12, 34, 1, 'fw') + R(22, -34, 12, 34, 1, 'fw')); };
  A.paper = function () { return sh(62, 106, 42) + at(66, 104, 1, R(-24, -60, 44, 56, 2, 'fw'), 8) + at(60, 104, 1, R(-24, -62, 44, 58, 2, 'fw') + L('M-14 -48 L10 -48 M-14 -38 L10 -38 M-14 -28 L4 -28', 'th'), -4) + at(24, 100, 1, R(-3, -34, 6, 34, 3, 'wood') + P('M-3 -34 C-6 -42 6 -42 3 -34Z', 'fk'), -24); };
  A.zero = function () { return R(14, 14, 92, 92, 18, 'fw') + T(60, 88, '0', 72) + T(28, 36, '1', 14) + T(92, 36, '2', 14) + T(28, 100, '3', 14) + T(92, 100, '9', 14); };
  A.printing = function () { return sh(60, 106, 48) + at(36, 104, 1, R(-22, -30, 44, 30, 3, 'wood') + L('M-14 -22 L-14 -8 M-6 -22 L-6 -8 M2 -22 L2 -8 M10 -22 L10 -8 M-14 -15 L-8 -15 M2 -15 L10 -15', 'th')) + at(86, 104, 1, R(-20, -56, 40, 56, 2, 'fw') + L('M-12 -46 L-12 -30 M-4 -46 L-4 -30 M4 -46 L4 -30 M12 -46 L12 -30 M-12 -22 L-12 -8 M-4 -22 L-4 -8 M4 -22 L4 -8', 'th')); };
  A.firearms = function () { return sh(56, 104, 48) + puff(100, 40, 0.8) + C(88, 50, 3, 'flame') + at(52, 88, 1, R(-36, -10, 66, 20, 10, 'iron') + R(26, -12, 8, 24, 3, 'iron'), -16) + wheel(46, 90, 14, 'wood'); };
  A.windmill = function () { var s = ''; for (var i = 0; i < 4; i++) s += at(60, 42, 1, R(-6, -46, 12, 40, 1, 'cloth') + L('M0 -4 L0 -46'), 45 + i * 90); return ground(102, 'leaf') + P('M44 104 L48 42 L72 42 L76 104Z', 'fw') + P('M42 44 L60 26 L78 44Z', 'red') + R(54, 84, 12, 20, 6, 'fk') + s + C(60, 42, 4, 'fk'); };
  // chapter 5
  A.coal = function () { return sh(56, 106, 48) + at(48, 98, 1, C(-18, -26, 9, 'fk') + C(-2, -30, 10, 'fk') + C(16, -26, 9, 'fk') + R(-30, -26, 60, 22, 3, 'iron')) + C(30, 102, 6, 'fw') + C(66, 102, 6, 'fw') + flame(98, 104, 0.55); };
  A['spinning-wheel'] = function () { return sh(60, 106, 48) + L('M42 94 L42 106 M30 106 L54 106 M72 64 L92 64 L92 106 M42 34 L92 58') + wheel(42, 64, 30, 'wood') + spool(96, 68, 0.5, 'cloth'); };
  A.science = function () { return R(10, 14, 100, 70, 6, 'fk') + R(84, 26, 8, 48, 1, 'fw') + S('M36 50 L84 32 M36 50 L84 50 M36 50 L84 68', 'flame', 0.8) + C(32, 50, 6, 'flame') + book(60, 112, 0.6); };
  A.compass = function () { return sh(60, 104, 40) + compass(60, 60, 40); };
  A.clocks = function () { return sh(60, 108, 32) + R(36, 30, 48, 78, 3, 'stone') + P('M32 32 L60 8 L88 32Z', 'red') + clockFace(60, 54, 18, 10, 10) + gear(50, 92, 9, 8, 'gold') + gear(70, 94, 7, 6, 'gold'); };
  A.eyeglasses = function () { return L('M14 56 L6 46 M106 56 L114 46') + C(36, 60, 22, 'sky') + C(84, 60, 22, 'sky') + L('M58 58 C60 54 60 54 62 58') + L('M24 52 C28 46 34 44 40 46 M72 52 C76 46 82 44 88 46', 'th'); };
  A.coffee = function () { return sh(56, 104, 42) + mug(54, 102, 1.45, 'fw') + steam(52, 36, 1.1) + E(100, 96, 5, 7, 'earth') + E(16, 98, 5, 7, 'earth') + L('M100 90 L100 102 M16 92 L16 104', 'th'); };
  A.post = function () { return sh(60, 106, 46) + envelope(60, 94, 1.45) + bird(96, 22, 0.7); };
  A.heliocentrism = function () { return night() + '<circle class="ln th" style="stroke:#ffffff66" cx="60" cy="60" r="26"/><circle class="ln th" style="stroke:#ffffff66" cx="60" cy="60" r="42"/>' + sun(60, 60, 10) + C(86, 60, 5, 'water') + C(30, 32, 6, 'red') + C(50, 86, 4, 'metal'); };
  A.toilets = function () { return sh(60, 106, 42) + R(64, 20, 30, 34, 4, 'fw') + R(86, 24, 8, 4, 1, 'metal') + at(60, 106, 1, P('M-28 -50 L22 -50 C22 -32 14 -28 8 -26 L10 0 L-16 0 L-14 -26 C-22 -28 -28 -36 -28 -50Z', 'fw') + E(-3, -50, 25, 6, 'fw')) + drop(36, 30, 0.4); };
  A.newspapers = function () { return sh(60, 106, 42) + at(60, 104, 1, R(-36, -80, 72, 80, 2, 'fw') + R(-30, -74, 60, 12, 1, 'fk') + R(-30, -56, 28, 24, 1, 'fb') + L('M4 -54 L30 -54 M4 -46 L30 -46 M4 -38 L26 -38 M-30 -24 L30 -24 M-30 -16 L30 -16 M-30 -8 L20 -8', 'th')); };
  A.telescope = function () { return night() + moon(92, 30, 11, 'fw') + star(28, 26, 3) + star(68, 18, 2.5) + L('M50 78 L36 112 M50 78 L64 112 M50 78 L50 112') + at(50, 78, 1, R(-30, -8, 58, 16, 4, 'gold') + R(-40, -6, 12, 12, 2, 'gold') + R(28, -10, 8, 20, 2, 'gold'), -32); };
  A['piped-water'] = function () { return sh(62, 106, 34) + tap(70, 76, 1.3) + drop(84, 92, 0.5) + drop(84, 110, 0.35); };
  A.microscope = function () { return sh(56, 108, 42) + at(56, 108, 1, R(-30, -8, 60, 8, 3, 'iron') + L('M10 -8 C28 -20 28 -50 10 -66') + R(-18, -36, 36, 5, 1, 'iron') + at(-2, -58, 1, R(-6, -26, 12, 42, 3, 'metal') + R(-8, -30, 16, 6, 2, 'iron'), -24)) + germ(98, 30, 6) + germ(98, 64, 5, 'fa'); };
  A.steam = function () { return sh(60, 106, 50) + R(28, 24, 6, 36, 1, 'iron') + R(98, 24, 4, 64, 1, 'iron') + L('M74 46 L74 28 M24 24 L106 24') + C(70, 24, 4, 'fk') + R(14, 60, 40, 46, 4, 'iron') + flame(34, 102, 0.4) + R(64, 46, 18, 60, 2, 'metal') + puff(28, 54, 0.55); };
  A.circadian = function () { return C(60, 60, 46, 'sky') + P('M60 14 A46 46 0 0 1 60 106Z', 'night') + sun(36, 50, 9) + moon(84, 44, 10, 'fw') + star(84, 78, 3) + star(94, 64, 2) + C(60, 60, 46, 'fnone'); };
  // chapter 6
  A['machine-cloth'] = function () { return sh(60, 106, 50) + R(12, 40, 96, 66, 3, 'wood') + gear(32, 62, 13, 8, 'metal') + gear(52, 76, 9, 6, 'metal') + spool(78, 80, 0.75, 'fa') + spool(96, 80, 0.75, 'water') + L('M78 54 L78 30 M96 54 L96 30', 'th'); };
  A.vaccination = function () { return sh(60, 106, 42) + cow(26, 110, 0.4) + syringe(64, 56, 1.3, -30); };
  A['clean-water'] = function () { return sh(60, 106, 34) + at(60, 106, 1, P('M-24 -72 L24 -72 L18 0 L-18 0Z', 'fw') + P('M-22 -48 L22 -48 L18 0 L-18 0Z', 'water') + L('M-12 -32 C-10 -22 -10 -16 -12 -8', 'th')) + sparkle(98, 34, 6) + sparkle(22, 50, 4); };
  A.canning = function () { return sh(60, 106, 42) + can(46, 106, 1.25) + bottle(94, 106, 0.6, 'red'); };
  A.bicycle = function () { return sh(60, 106, 52) + bicycle(60, 106, 1.2); };
  A.railways = function () { return P('M8 102 L112 102 L112 106 L8 106Z', 'iron') + L('M16 106 L16 112 M36 106 L36 112 M56 106 L56 112 M76 106 L76 112 M96 106 L96 112', 'th') + train(64, 100, 1.05); };
  A['clean-cooking'] = function () { return sh(60, 106, 48) + steam(60, 24, 0.6) + R(20, 58, 80, 48, 4, 'fw') + R(28, 74, 64, 26, 2, 'fk') + R(32, 78, 56, 18, 1, 'stone') + C(32, 66, 3, 'fk') + C(44, 66, 3, 'fk') + pot(60, 52, 0.6, 'metal') + S('M48 58 L50 54 M56 58 L57 54 M64 58 L63 54 M72 58 L70 54', 'water', 1); };
  A.telegraph = function () { return sh(56, 106, 48) + L('M80 94 C96 94 96 60 100 40 M100 40 L100 106 M92 40 L110 40') + R(18, 88, 64, 12, 2, 'wood') + R(28, 82, 28, 6, 1, 'metal') + R(48, 76, 26, 6, 2, 'metal') + C(76, 72, 5, 'fk') + L('M18 30 L28 30 M36 30 L38 30 M46 30 L56 30 M64 30 L66 30'); };
  A.photography = function () { return sh(60, 106, 44) + L('M42 80 L30 108 M78 80 L90 108 M60 80 L60 108') + R(32, 40, 56, 40, 4, 'wood') + R(36, 32, 14, 8, 1, 'metal') + C(60, 60, 14, 'fk') + C(60, 60, 8, 'sky'); };
  A.camera = function () { return sh(60, 104, 42) + R(36, 38, 22, 12, 3, 'fk') + R(22, 46, 76, 50, 8, 'fk') + C(60, 71, 18, 'metal') + C(60, 71, 11, 'sky') + C(86, 56, 4, 'flame'); };
  A.sanitation = function () { return sh(56, 106, 42) + at(56, 106, 1.1, R(-24, -56, 48, 56, 2, 'wood') + P('M-30 -54 L0 -70 L30 -54Z', 'leaf') + R(-14, -46, 28, 46, 2, 'fw') + C(8, -24, 2, 'fk') + moon(0, -38, 5, 'gold')) + drop(102, 92, 0.5) + sparkle(16, 40, 5); };
  A.anesthesia = function () { return sh(60, 104, 48) + R(12, 80, 96, 14, 4, 'fw') + R(38, 68, 60, 14, 7, 'fa') + C(28, 72, 10, 'fw') + L('M24 70 L28 72 M30 70 L34 72', 'th') + T(56, 46, 'z', 14) + T(72, 34, 'z', 18) + T(92, 22, 'Z', 22); };
  A['sewing-machine'] = function () { return sh(60, 106, 48) + at(60, 106, 1, R(-44, -10, 88, 10, 2, 'wood') + spool(-4, -58, 0.5, 'red') + P('M-30 -10 L-30 -58 L26 -58 C32 -58 34 -54 34 -48 L34 -34 L22 -34 L22 -46 L-18 -46 L-18 -10Z', 'fa') + R(24, -34, 8, 14, 1, 'metal') + L('M28 -20 L28 -12')); };
  A.steel = function () { var beam = 'M-17 0 L-17 -8 L-7 -8 L-7 -28 L-17 -28 L-17 -36 L17 -36 L17 -28 L7 -28 L7 -8 L17 -8 L17 0Z'; return sh(60, 106, 50) + at(60, 64, 1, R(-44, -8, 88, 8, 1, 'metal') + L('M-44 -8 L-33 -36 L-22 -8 L-11 -36 L0 -8 L11 -36 L22 -8 L33 -36 L44 -8 M-33 -36 L33 -36')) + at(38, 106, 1, P(beam, 'metal')) + at(82, 106, 1, P(beam, 'metal')); };
  A['germ-theory'] = function () { return C(60, 60, 46, 'fw') + C(60, 60, 40, 'sky') + germ(44, 46, 9) + germ(76, 72, 8, 'fa') + at(74, 38, 1, R(-12, -3, 24, 6, 3, 'leaf'), 30) + at(40, 82, 1, R(-12, -3, 24, 6, 3, 'leaf'), -20); };
  A.oil = function () { return ground(104, 'sand') + L('M40 104 L56 18 L64 18 L80 104 M44 84 L76 84 M48 64 L72 64 M52 44 L68 44 M44 84 L72 64 M76 84 L48 64 M48 64 L68 44 M72 64 L52 44') + R(50, 12, 20, 6, 1, 'fk') + drop(98, 62, 0.85, 'fk'); };
  A.evolution = function () { return sh(60, 110, 34) + L('M60 110 L60 76 M60 76 C60 62 40 58 34 46 M60 76 C62 60 84 58 88 42 M34 46 C30 36 22 32 18 26 M34 46 C38 36 44 32 48 24 M88 42 L84 24 M88 42 C94 34 100 32 104 28') + C(18, 24, 6, 'fa') + C(48, 22, 6, 'leaf') + C(84, 22, 6, 'gold') + C(104, 26, 6, 'water') + C(60, 76, 4, 'fk') + C(34, 46, 3, 'fk') + C(88, 42, 3, 'fk'); };
  A['combustion-engine'] = function () { return sh(60, 106, 48) + puff(104, 56, 0.4) + R(94, 70, 14, 10, 2, 'fk') + R(34, 22, 14, 10, 1, 'fk') + R(56, 22, 14, 10, 1, 'fk') + R(32, 30, 18, 24, 2, 'metal') + R(54, 30, 18, 24, 2, 'metal') + R(26, 50, 68, 56, 4, 'iron') + C(48, 80, 11, 'metal') + C(48, 80, 4, 'fk') + bolt(80, 54, 0.35); };
  A.brain = function () { return sh(60, 108, 42) + brain(60, 86, 1.3, 'fb') + sparkle(100, 24, 5); };
  A['weather-forecast'] = function () { return sun(40, 42, 16) + cloud(74, 72, 1.35, 'fw') + S('M58 84 L54 94 M70 84 L66 94 M82 84 L78 94', 'water', 1) + bolt(98, 108, 0.4); };
  A.telephone = function () { return sh(60, 106, 36) + L('M32 82 C34 102 50 102 54 98') + at(60, 106, 1, R(-14, -8, 28, 8, 3, 'fk') + R(-4, -62, 8, 56, 3, 'fk') + P('M-10 -72 L10 -72 L6 -60 L-6 -60Z', 'fk') + C(0, -74, 6, 'fk')) + at(30, 76, 1, R(-4, -20, 8, 26, 3, 'fk') + E(0, -20, 8, 5, 'fk')); };
  A['recorded-sound'] = function () { return sh(54, 106, 48) + R(14, 78, 58, 28, 3, 'wood') + E(43, 78, 27, 5, 'fk') + L('M60 72 L72 54') + P('M70 58 C74 42 86 26 108 16 L110 46 C96 46 82 52 76 60Z', 'gold') + T(28, 44, '♪', 22) + T(48, 32, '♫', 18); };
  A['lost-damascus-steel'] = function () { return grp('fade', sword(60, 110, 1.2, 'metal', 0)) + L('M58 40 C62 46 56 52 60 58 C64 64 56 70 60 76', 'th') + T(92, 40, '?', 20); };
  A['lost-polar-inuit'] = function () { return star(96, 20, 3, 'fw') + sparkle(22, 24, 4) + water(8, 112, 90) + grp('fade', at(62, 80, 1, L('M-22 -18 L20 10') + P('M-48 0 C-30 -9 30 -9 48 0 C30 7 -30 7 -48 0Z', 'cloth') + E(0, -3, 7, 3, 'fk')) + L('M26 26 C40 40 40 56 26 70 M26 26 L26 70') + arrow(106, 44, 44, 170)); };
  // chapter 7
  A.lightbulb = function () { return sh(60, 110, 22) + bulb(60, 108, 1.2, true); };
  A.electricity = function () { return L('M8 50 C20 58 40 58 60 54 C80 58 100 58 112 50 M8 38 C20 46 40 46 60 42', 'th') + pylon(28, 108, 1.2) + pylon(92, 108, 1.2) + house(60, 108, 0.6, 'fw', 'red') + bolt(60, 34, 0.4); };
  A.motorbike = function () { return sh(60, 106, 50) + at(60, 88, 1, L('M20 -26 L30 -44 L38 -44 M26 -10 L32 0') + P('M-26 -10 L-14 -26 L16 -26 L26 -10Z', 'fa') + R(-12, -36, 24, 8, 4, 'fk')) + wheel(28, 88, 16, 'fk') + wheel(92, 88, 16, 'fk') + R(46, 78, 18, 10, 2, 'metal'); };
  A.car = function () { return sh(60, 106, 52) + oldCar(60, 106, 1.15, 'fa'); };
  A.tractors = function () { return ground(104, 'earth') + R(80, 38, 6, 18, 1, 'fk') + R(30, 30, 28, 26, 2, 'fw') + R(34, 34, 20, 18, 1, 'sky') + R(28, 54, 72, 26, 3, 'fa') + wheel(38, 84, 21, 'fk') + wheel(92, 94, 11, 'fk'); };
  A.imaging = function () { return R(18, 12, 84, 96, 8, 'fk') + R(24, 18, 72, 84, 4, 'night') + at(60, 98, 1.1, S('M-14 0 L-12 -24 M-4 0 L-4 -26 M6 0 L4 -24 M-12 -24 L-18 -42 M-4 -26 L-6 -50 M4 -24 L4 -52 M4 -24 L12 -48 M12 -18 L22 -38 M-12 -30 L-26 -40', 'sky', 1.2)); };
  A.cinema = function () { return sh(56, 106, 46) + P('M104 58 L118 46 L118 100 L104 88Z', 'flame nos') + C(36, 40, 16, 'fk') + C(36, 40, 6, 'fw') + C(64, 40, 16, 'fk') + C(64, 40, 6, 'fw') + L('M40 88 L32 106 M60 88 L68 106') + R(22, 58, 56, 30, 4, 'fk') + P('M78 66 L104 54 L104 92 L78 80Z', 'fk'); };
  A.ac = function () { return R(12, 18, 96, 40, 6, 'fw') + L('M20 44 L100 44 M20 50 L100 50', 'th') + C(92, 28, 3, 'leaf') + L('M60 70 L60 106 M44 79 L76 97 M76 79 L44 97') + S('M60 70 L60 106 M44 79 L76 97 M76 79 L44 97', 'water', 0.6) + L('M55 65 L60 70 L65 65 M55 111 L60 106 L65 111', 'th'); };
  A.plastics = function () { return sh(60, 106, 48) + bottle(34, 106, 1.05, 'water') + at(82, 106, 1, R(-16, -30, 10, 8, 2, 'red') + R(6, -30, 10, 8, 2, 'red') + R(-20, -22, 40, 22, 3, 'red')) + at(82, 82, 1, R(-10, -24, 8, 6, 2, 'gold') + R(2, -24, 8, 6, 2, 'gold') + R(-14, -18, 28, 18, 3, 'gold')); };
  A['washing-machine'] = function () { return sh(60, 108, 42) + R(26, 16, 68, 92, 6, 'fw') + L('M26 36 L94 36') + C(40, 26, 3, 'fk') + R(62, 22, 24, 7, 2, 'fb') + C(60, 72, 25, 'fk') + C(60, 72, 19, 'water') + bubbles(54, 80) + L('M46 70 C52 64 58 76 64 70 C70 64 72 70 76 68', 'th'); };
  A.fertilizer = function () { return sh(60, 106, 48) + at(44, 106, 1, P('M-26 0 C-30 -20 -28 -48 -22 -60 L22 -60 C28 -48 30 -20 26 0Z', 'cloth') + L('M-22 -60 C-14 -54 14 -54 22 -60', 'th') + T(0, -24, 'N', 22)) + sprout(94, 106, 1.25); };
  A.fridge = function () { return sh(60, 108, 36) + R(32, 12, 56, 96, 6, 'fw') + L('M32 46 L88 46') + R(78, 22, 4, 16, 2, 'metal') + R(78, 56, 4, 24, 2, 'metal') + star(48, 30, 6, 'sky') + L('M40 60 L48 64 M40 70 L48 74', 'th'); };
  A.air = function () { return cloud(26, 100, 0.8, 'fw') + cloud(98, 34, 0.6, 'fw') + at(60, 62, 1.05, R(-36, -28, 72, 6, 2, 'fa') + L('M-28 -22 L-28 0 M28 -22 L28 0 M-10 -22 L-10 0 M10 -22 L10 0') + P('M-24 -6 C-24 -14 30 -14 40 -6 C44 -2 40 4 34 4 L-20 4 C-24 4 -24 0 -24 -6Z', 'fw') + R(-36, -2, 72, 6, 2, 'fa') + P('M-24 -4 L-44 -16 L-46 -4 L-44 2Z', 'fa') + R(42, -14, 4, 22, 2, 'fk') + C(8, -8, 4, 'fk')); };
  A.radio = function () { return sh(56, 106, 46) + L('M94 26 C100 30 100 38 94 42 M102 20 C112 28 112 40 102 48', 'th') + at(56, 106, 1, P('M-36 0 L-36 -40 C-36 -66 36 -66 36 -40 L36 0Z', 'wood') + P('M-26 -12 L-26 -40 C-26 -56 26 -56 26 -40 L26 -12Z', 'cloth') + L('M-14 -48 L-14 -16 M-4 -54 L-4 -16 M6 -54 L6 -16 M16 -48 L16 -16', 'th') + C(-14, -6, 3, 'fk') + C(14, -6, 3, 'fk')); };
  A.antibiotics = function () { return C(54, 58, 42, 'fw') + C(54, 58, 36, 'sand') + '<circle class="ln th" style="stroke-dasharray:3 4" cx="48" cy="52" r="22"/>' + C(48, 52, 12, 'leaf') + germ(76, 80, 5, 'red') + germ(80, 42, 4, 'red') + pill(92, 100, 0.6, -30); };
  A['synthetic-fibers'] = function () { return sh(54, 106, 42) + at(54, 104, 1.1, P('M-16 -60 L-34 -48 L-26 -34 L-18 -40 L-18 0 L18 0 L18 -40 L26 -34 L34 -48 L16 -60 C8 -52 -8 -52 -16 -60Z', 'fa') + L('M0 -54 L0 -6', 'th') + R(-2, -56, 4, 8, 1, 'metal')) + L('M94 24 L102 18 L110 24 L110 36 L102 42 L94 36Z', 'th') + C(94, 24, 2.5, 'fk') + C(110, 36, 2.5, 'fk'); };
  A.tv = function () { return sh(60, 106, 42) + L('M50 30 L38 10 M60 30 L76 8 M36 94 L30 106 M84 94 L90 106') + R(18, 30, 84, 64, 10, 'wood') + R(26, 38, 58, 48, 8, 'sky') + C(94, 52, 4, 'fk') + C(94, 66, 4, 'fk') + person(55, 82, 0.5, 'fa', 'M-11 -40 L-19 -22 M11 -40 L22 -56'); };
  A['blood-banks'] = function () { return sh(60, 108, 30) + L('M60 8 L60 20 M60 96 L60 112') + at(60, 96, 1, P('M-22 -76 L22 -76 L22 -8 C22 -2 18 0 12 0 L-12 0 C-18 0 -22 -2 -22 -8Z', 'fw') + P('M-22 -46 L22 -46 L22 -8 C22 -2 18 0 12 0 L-12 0 C-18 0 -22 -2 -22 -8Z', 'red') + L('M-14 -66 L-4 -66 M-14 -58 L-4 -58', 'th') + heart(0, -14, 0.6, 'fw')); };
  A['nuclear-weapons'] = function () { return ground(106, 'sand') + P('M50 106 C52 88 50 76 48 64 L72 64 C70 76 68 88 70 106Z', 'cloth') + E(60, 104, 40, 6, 'cloth') + at(60, 56, 1, P('M-38 4 C-46 -4 -40 -18 -28 -18 C-26 -34 -6 -38 2 -30 C10 -40 32 -34 30 -18 C42 -18 46 -2 36 4 C20 12 -20 12 -38 4Z', 'fire')) + E(60, 66, 26, 6, 'cloth'); };
  // chapter 8
  A.microwave = function () { return sh(60, 100, 48) + R(12, 34, 96, 64, 6, 'fw') + R(20, 42, 60, 48, 4, 'night') + R(86, 44, 14, 8, 1, 'fk') + C(93, 62, 4, 'fk') + C(93, 78, 4, 'fk') + bowl(50, 84, 0.7, 'clay') + steam(50, 64, 0.5); };
  A.transistor = function () { return sh(54, 108, 34) + at(54, 76, 1.2, L('M-10 0 L-12 26 M0 0 L0 26 M10 0 L12 26') + P('M-18 0 L-18 -24 C-18 -36 18 -36 18 -24 L18 0Z', 'fk')) + bolt(96, 50, 0.55); };
  A.payments = function () { return sh(54, 104, 48) + at(54, 70, 1.1, R(-36, -24, 72, 48, 6, 'fa') + R(-26, -12, 14, 11, 2, 'gold') + L('M-26 10 L-10 10 M-4 10 L4 10 M10 10 L18 10', 'th'), -8) + L('M96 28 C102 32 102 40 96 44 M104 22 C114 30 114 42 104 50', 'th'); };
  A.dna = function () { return dna(60, 100, 1.3, 20) + sparkle(24, 30, 5); };
  A.nuclear = function () { return ground(104, 'leaf') + puff(44, 42, 0.8) + at(44, 104, 1, P('M-24 0 C-18 -20 -18 -40 -20 -56 L20 -56 C18 -40 18 -20 24 0Z', 'fw')) + R(76, 74, 28, 30, 2, 'fw') + E(90, 74, 14, 5, 'stone') + atom(90, 46, 12); };
  A.solar = function () { return sun(94, 24, 10) + ground(104, 'leaf') + panel(54, 102, 1.25); };
  A.container = function () { return water(8, 112, 92) + at(60, 94, 1, R(20, -44, 16, 30, 1, 'fw') + R(24, -40, 8, 6, 1, 'sky') + P('M-50 -14 L50 -14 L42 4 L-46 4Z', 'red') + R(-42, -26, 18, 12, 1, 'fa') + R(-24, -26, 18, 12, 1, 'gold') + R(-6, -26, 18, 12, 1, 'water') + R(-42, -38, 18, 12, 1, 'leaf') + R(-24, -38, 18, 12, 1, 'fa')); };
  A.contraception = function () { var p = ''; for (var r = 0; r < 3; r++) for (var i = 0; i < 5; i++) p += C(30 + i * 15, 46 + r * 16, 4.5, r * 5 + i < 9 ? 'fa' : 'fw'); return sh(60, 104, 46) + R(18, 32, 84, 58, 10, 'metal') + p + T(60, 108, 'M T W T F', 10); };
  A.hyv = function () { return ground(106, 'earth') + wheat(42, 106, 1.25) + wheat(82, 106, 0.6) + L('M100 40 L100 20 M94 26 L100 20 L106 26', 'th'); };
  A['moon-landing'] = function () { return night() + globe(90, 30, 12) + P('M8 92 C40 84 80 84 112 92 L112 112 L8 112Z', 'stone') + L('M72 92 L72 50') + R(72, 50, 22, 14, 1, 'fw') + L('M76 54 L90 54 M76 58 L86 58', 'th') + person(44, 94, 0.9, 'fw', 'M-11 -40 L-19 -24 M11 -40 L20 -28', R(-7, -58, 14, 9, 4, 'gold')); };
  A['video-games'] = function () { return sh(60, 104, 48) + at(60, 78, 1, P('M-40 -10 C-40 -22 -30 -24 -18 -22 L18 -22 C30 -24 40 -22 40 -10 L44 14 C46 24 36 26 30 18 L22 8 L-22 8 L-30 18 C-36 26 -46 24 -44 14Z', 'fk') + R(-30, -10, 14, 4, 1, 'fw') + R(-25, -15, 4, 14, 1, 'fw') + C(20, -12, 4, 'red') + C(28, -4, 4, 'gold')) + star(36, 28, 7, 'gold') + heart(84, 36, 0.6); };
  A['lost-last-moon-landing'] = function () { return C(60, 64, 40, 'stone') + C(44, 50, 7, 'fb') + C(76, 82, 9, 'fb') + C(80, 46, 5, 'fb') + grp('fade', at(56, 74, 1, E(0, 0, 4, 7, 'fk') + E(10, -10, 4, 7, 'fk') + E(2, -22, 4, 7, 'fk'))) + star(20, 20, 3) + star(100, 24, 2.5); };
  // chapter 9
  A['cognitive-biases'] = function () { return sh(48, 106, 40) + at(44, 106, 1.1, P('M-24 0 L-24 -20 C-40 -26 -42 -56 -24 -68 C-6 -80 26 -76 32 -54 C34 -46 40 -40 34 -36 L30 -34 L30 -20 C30 -14 24 -12 18 -12 L14 -12 L14 0Z', 'fb')) + at(84, 40, 1, L('M-18 -8 L18 -8 M-18 -8 L-12 -14 M-18 -8 L-12 -2 M18 -8 L12 -14 M18 -8 L12 -2 M-18 12 L18 12 M-18 12 L-24 6 M-18 12 L-24 18 M18 12 L24 6 M18 12 L24 18')) + T(84, 82, '?', 18); };
  A.computer = function () { return sh(60, 108, 48) + screen(60, 92, 1.1, R(-26, -50, 30, 4, 1, 'leaf') + R(-26, -42, 40, 4, 1, 'leaf') + R(-26, -34, 22, 4, 1, 'leaf')) + R(26, 98, 68, 10, 2, 'fw') + L('M34 103 L86 103', 'th'); };
  A.gps = function () { return L('M38 32 C42 36 44 40 44 44 M44 26 C50 32 52 38 52 46', 'th') + globe(62, 76, 32) + at(68, 80, 1, P('M0 0 C-4 -8 -12 -14 -12 -22 C-12 -30 -6 -34 0 -34 C6 -34 12 -30 12 -22 C12 -14 4 -8 0 0Z', 'red') + C(0, -22, 4, 'fw')) + satellite(26, 22, 0.5, -20); };
  A.ivf = function () { return L('M102 18 L76 48') + R(98, 10, 8, 12, 2, 'metal') + C(60, 64, 42, 'fw') + C(60, 64, 36, 'sky') + C(60, 64, 16, 'fb') + C(54, 60, 6, 'fw') + C(66, 68, 6, 'fw') + heart(94, 110, 0.5); };
  A.mobile = function () { return sh(56, 108, 30) + L('M84 32 C90 36 90 44 84 48 M92 26 C102 34 102 46 92 54', 'th') + at(56, 106, 1.1, R(6, -82, 4, 14, 2, 'fk') + R(-14, -70, 28, 70, 5, 'fk') + R(-10, -62, 20, 18, 2, 'leaf') + [0, 1, 2, 3].map(function (r) { return [0, 1, 2].map(function (i) { return R(-9 + i * 7, -38 + r * 8, 5, 5, 1, 'metal'); }).join(''); }).join('')); };
  A.wind = function () { return ground(104, 'leaf') + turbine(44, 106, 1.2) + turbine(92, 100, 0.75) + L('M8 30 C20 26 28 34 40 30 M14 44 C24 40 30 46 40 42', 'th'); };
  A.internet = function () { return globe(60, 60, 42) + L('M30 42 L62 56 L86 34 M62 56 L94 78 L46 90 L62 56 M30 42 L46 90', 'th') + C(30, 42, 5, 'fa') + C(86, 34, 5, 'fa') + C(94, 78, 5, 'fa') + C(46, 90, 5, 'fa') + C(62, 56, 5, 'fa'); };
  A['prenatal-nutrition'] = function () { return sh(60, 106, 46) + heart(60, 40, 1, 'red') + C(42, 80, 9, 'red') + C(60, 76, 9, 'leaf') + C(78, 80, 9, 'gold') + bowl(60, 106, 1.5, 'fw'); };
  A['gm-crops'] = function () { return sh(48, 108, 32) + at(46, 106, 1, P('M-12 -10 C-30 -30 -26 -60 -20 -70 C-14 -50 -14 -30 0 0Z', 'leaf') + P('M12 -10 C30 -30 26 -60 20 -70 C14 -50 14 -30 0 0Z', 'leaf') + P('M-12 -10 C-14 -40 -10 -70 0 -80 C10 -70 14 -40 12 -10Z', 'gold') + L('M-7 -70 L7 -70 M-9 -60 L9 -60 M-11 -50 L11 -50 M-11 -40 L11 -40 M-11 -30 L11 -30 M-11 -20 L11 -20 M0 -78 L0 -12', 'th') + P('M-12 -10 C-24 -20 -22 -40 -18 -50 C-12 -34 -10 -20 0 0Z', 'leaf')) + dna(96, 92, 0.6, 15); };
  A.cloning = function () { return sh(60, 106, 52) + sheep(34, 102, 1) + sheep(88, 102, 1) + T(61, 80, '=', 24); };
  A['childhood-trauma'] = function () { return sh(60, 108, 44) + heart(60, 32, 0.7, 'red') + sprout(60, 96, 1.7) + hand(32, 108, 0.8, 'sand', 50) + hand(88, 108, 0.8, 'cloth', -50); };
  A.iot = function () { return sh(60, 106, 46) + house(60, 106, 1.4, 'fw', 'fa') + L('M44 24 C52 16 68 16 76 24 M49 31 C55 26 65 26 71 31') + C(60, 37, 3, 'fk'); };
  A['social-media'] = function () { return at(78, 104, 0.9, P('M-26 -36 C-26 -46 26 -46 26 -36 L26 -14 C26 -6 20 -6 12 -6 L4 -6 L-6 4 L-4 -6 L-18 -6 C-24 -6 -26 -8 -26 -14Z', 'fa')) + L('M64 74 L90 74 M64 82 L84 82', 'th') + speech(44, 60, 1.1, 'fw') + heart(44, 40, 0.6, 'red'); };
  A.smartphone = function () { return sh(60, 110, 26) + phone(60, 108, 1.45, R(-10, -50, 8, 8, 2, 'red') + R(1, -50, 8, 8, 2, 'leaf') + R(-10, -40, 8, 8, 2, 'gold') + R(1, -40, 8, 8, 2, 'water') + R(-10, -30, 8, 8, 2, 'fa') + R(1, -30, 8, 8, 2, 'clay')); };
  A.ev = function () { return sh(56, 106, 52) + L('M98 86 C108 86 110 72 104 66') + R(98, 52, 12, 14, 2, 'fk') + car(54, 106, 1.05, 'leaf') + bolt(54, 68, 0.35); };
  A.blockchain = function () { return [0, 1, 2].map(function (i) { var x = 10 + i * 36; return R(x, 40, 28, 28, 4, i === 2 ? 'fa' : 'gold') + L('M' + (x + 7) + ' 48 L' + (x + 21) + ' 48 M' + (x + 7) + ' 54 L' + (x + 21) + ' 54 M' + (x + 7) + ' 60 L' + (x + 17) + ' 60', 'th'); }).join('') + L('M38 54 L46 54 M74 54 L82 54') + coin(60, 94, 11) + T(60, 99, '₿', 13); };
  A.mrna = function () { return sh(56, 106, 42) + at(40, 106, 1, R(-12, -52, 24, 52, 4, 'fw') + R(-12, -26, 24, 26, 4, 'fa') + R(-14, -60, 28, 10, 2, 'gold')) + L('M66 100 C72 92 78 106 84 98 C90 90 96 104 102 96') + syringe(84, 52, 0.8, -60); };
  A.ai = function () { return chip(60, 62, 1.15) + T(60, 68, 'AI', 15) + sparkle(102, 22, 6) + sparkle(18, 102, 5) + sparkle(104, 104, 3); };
  A['lost-concorde'] = function () { return star(22, 26, 3, 'fw') + star(98, 96, 2.5, 'fw') + sparkle(96, 26, 4) + grp('fade', at(58, 60, 1.05, P('M48 0 L40 -2 L-34 -3 L-44 -14 L-50 -14 L-46 -2 L-50 0 L-46 2 L-50 14 L-44 14 L-34 3 L40 2Z', 'fw') + P('M16 -2 L-30 -34 L-38 -34 L-30 -2Z', 'fw') + P('M16 2 L-30 34 L-38 34 L-30 2Z', 'fw'), -14)); };
  // losses in earlier chapters
  A['lost-tasmania'] = function () { return water(8, 112, 76) + island(60, 84, 1.3) + grp('fade', needle(36, 40, 0.6, -20) + L('M82 24 L82 44 C82 52 92 52 92 44')); };
  A['lost-bronze-age-collapse'] = function () { return ground(100, 'sand') + at(40, 102, 1, R(-8, -60, 16, 60, 1, 'stone') + R(-12, -64, 24, 6, 1, 'stone')) + at(76, 102, 1, P('M-8 0 L-8 -26 L-2 -32 L4 -26 L8 -30 L8 0Z', 'stone')) + at(94, 102, 1, R(-30, -12, 30, 12, 1, 'stone')) + grp('fade', tablet(74, 62, 0.5)); };
  A['lost-antikythera'] = function () { return grp('fade', gear(48, 56, 28, 14, 'copper') + gear(86, 82, 16, 9, 'copper') + gear(82, 34, 11, 7, 'copper')); };
  A['lost-polynesian-pottery'] = function () { return water(8, 112, 88) + island(80, 94, 1) + grp('fade', pot(40, 78, 0.9, 'clay')); };
  A['lost-hieroglyphs'] = function () { return R(20, 14, 80, 92, 6, 'sand') + grp('fade', at(42, 44, 1, L('M-14 0 C-6 -10 6 -10 14 0 C6 10 -6 10 -14 0') + C(0, 0, 4, 'fk')) + at(78, 48, 1, P('M-8 6 C-8 -6 4 -12 10 -8 L14 -10 L10 -4 C8 4 2 6 -8 6Z', 'leaf') + L('M-2 6 L-2 14 M4 6 L4 14')) + L('M30 74 C40 68 50 80 60 74 M70 70 L90 70 M70 80 L84 90')) + T(60, 100, '?', 18); };
  A['lost-post-roman-britain'] = function () { return ground(100, 'leaf') + grp('fade', coin(38, 48, 16, 'metal') + pot(82, 84, 0.8, 'clay')) + L('M76 62 L82 74 L78 84', 'th'); };
  A['lost-roman-concrete'] = function () { return water(8, 112, 92) + grp('fade', arch(40, 92, 1, 'stone') + arch(84, 92, 1, 'stone')); };
  A['lost-ming-fleets'] = function () { return water(8, 112, 94) + grp('fade', at(60, 94, 1, L('M-24 -22 L-24 -74 M2 -22 L2 -84 M26 -22 L26 -70') + R(-36, -72, 22, 44, 2, 'red') + R(-10, -82, 24, 54, 2, 'red') + R(18, -68, 18, 40, 2, 'red') + L('M-36 -60 L-14 -60 M-36 -48 L-14 -48 M-10 -68 L14 -68 M-10 -54 L14 -54 M-10 -40 L14 -40 M18 -54 L36 -54 M18 -42 L36 -42', 'th') + P('M-50 -18 L50 -18 L40 0 L-40 0Z', 'wood'))); };
  A.lost = function () { return grp('fade', C(60, 60, 30, 'fw')) + T(60, 70, '?', 30); };
  // chapters and the end
  A['chapter-1'] = function () { return sh(60, 106, 50) + campfire(38, 102, 0.8) + handaxe(86, 102, 0.95); };
  A['chapter-2'] = function () { return P(CAVE, 'stone') + stencil(34, 68, 0.55, -12) + bison(78, 92, 0.85) + needle(76, 34, 0.5, -20); };
  A['chapter-3'] = function () { return sun(92, 24, 8) + ground(94, 'leaf') + roundhouse(36, 98, 0.85) + wheat(70, 98, 0.8) + wheat(84, 100, 0.7) + sheep(100, 110, 0.45); };
  A['chapter-4'] = function () { return sun(96, 24, 8) + ground(100, 'sand') + ziggurat(52, 102, 0.85) + tablet(98, 104, 0.45); };
  A['chapter-5'] = function () { return A.windmill() + sailboat(100, 110, 0.35, 'cloth'); };
  A['chapter-6'] = function () { return ground(104, 'stone') + factory(52, 104, 1.05); };
  A['chapter-7'] = function () { return bulb(44, 108, 1, true) + pylon(94, 108, 0.9); };
  A['chapter-8'] = function () { return night() + rocket(56, 92, 1) + star(24, 30, 3) + star(96, 24, 3) + moon(96, 72, 9, 'fw'); };
  A['chapter-9'] = function () { return globe(46, 56, 32) + phone(94, 108, 0.8, R(-10, -50, 20, 4, 1, 'fa') + R(-10, -42, 14, 4, 1, 'fa')); };
  A['the-end'] = function () { return sh(54, 108, 42) + child(44, 108, 1.3, 'fa', 'M-11 -40 L-19 -22 M11 -40 L22 -58') + bulb(86, 76, 0.65, true) + sparkle(102, 18, 5) + sparkle(18, 28, 4); };

  return {
    get: function (id) { var f = A[id]; return f ? f() : null; },
    has: function (id) { return !!A[id]; },
    ids: function () { return Object.keys(A); }
  };
})();
