/* Human Inventions: interactive technology adoption timeline. No dependencies. */
{
  'use strict';

  const D = window.INVENTIONS;
  const NOW = D.now;
  const OFF = 10;                 // log axis: years-before-present offset so "now" is finite
  const YMIN = NOW - 3500000;     // left edge of all time
  const CATS = D.cats;
  const CATI = {};
  CATS.forEach((c, i) => { CATI[c.id] = i; });
  const QLABEL = { 1: 'Measured', 2: 'Estimated', 3: 'Reconstructed' };
  const QTEXT = {
    1: 'Survey and census data for recent decades; earlier points are historians’ estimates.',
    2: 'Estimates from historians, agencies and industry figures.',
    3: 'Inferred from archaeology and population estimates. The shape is indicative, not precise.'
  };

  /* ---------------- curve maths ---------------- */

  // Steffen monotone cubic: smooth, never overshoots between anchors.
  function prep(t) {
    const search = (t.name + ' ' + t.where + ' ' + t.desc + ' ' + (t.shift || '') + ' ' + (t.by || '')).toLowerCase();
    if (t.kind === 'event') {
      return Object.assign({}, t, {
        isEvent: true, n: 0, xs: [], ys: [], m: [], origin: t.first, end: t.first, peak: 0, peakYear: t.first, latest: null,
        cross: { 10: null, 25: null, 50: null, 90: null }, halfPeak: null, declining: false, search
      });
    }
    const xs = t.pts.map(p => p[0]);
    const ys = t.pts.map(p => p[1]);
    const n = xs.length;
    const h = [], d = [];
    for (let i = 0; i < n - 1; i++) { h[i] = xs[i + 1] - xs[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
    const m = new Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
      const p = (d[i - 1] * h[i] + d[i] * h[i - 1]) / (h[i - 1] + h[i]);
      m[i] = (Math.sign(d[i - 1]) + Math.sign(d[i])) * Math.min(Math.abs(d[i - 1]), Math.abs(d[i]), 0.5 * Math.abs(p)) || 0;
    }
    const endSlope = (dd, mn) => {
      let s = (3 * dd - mn) / 2;
      if (Math.sign(s) !== Math.sign(dd)) s = 0;
      else if (Math.abs(s) > 3 * Math.abs(dd)) s = 3 * dd;
      return s;
    };
    if (n > 2) { m[0] = endSlope(d[0], m[1]); m[n - 1] = endSlope(d[n - 2], m[n - 2]); }
    else { m[0] = d[0]; m[1] = d[0]; }
    const o = Object.assign({}, t, { xs, ys, m, n, origin: xs[0], end: xs[n - 1] });
    let pk = 0;
    ys.forEach((v, i) => { if (v > ys[pk]) pk = i; });
    o.peak = ys[pk];
    o.peakYear = xs[pk];
    o.latest = ys[n - 1];
    o.cross = {};
    [10, 25, 50, 90].forEach(T => { o.cross[T] = crossing(o, T); });
    o.halfPeak = crossing(o, o.peak / 2);
    o.declining = o.latest < o.peak * 0.8;
    o.search = search;
    return o;
  }

  function herm(t, i, y) {
    const x0 = t.xs[i], hh = t.xs[i + 1] - x0, s = (y - x0) / hh;
    const s2 = s * s, s3 = s2 * s;
    const v = (2 * s3 - 3 * s2 + 1) * t.ys[i] + (s3 - 2 * s2 + s) * t.m[i] * hh
      + (-2 * s3 + 3 * s2) * t.ys[i + 1] + (s3 - s2) * t.m[i + 1] * hh;
    return v < 0 ? 0 : v > 100 ? 100 : v;
  }

  // value at year y; -1 before the technology existed; holds the last value afterwards
  function val(t, y) {
    if (t.isEvent) return -1;
    const xs = t.xs;
    if (y < xs[0]) return -1;
    if (y >= xs[t.n - 1]) return t.ys[t.n - 1];
    let lo = 0, hi = t.n - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= y) lo = mid; else hi = mid; }
    return herm(t, lo, y);
  }

  function crossing(t, T) {
    if (T <= 0) return t.xs[0];
    for (let i = 0; i < t.n - 1; i++) {
      if (t.ys[i] >= T) return t.xs[i];
      if (t.ys[i] < T && t.ys[i + 1] >= T) {
        let a = t.xs[i], b = t.xs[i + 1];
        for (let k = 0; k < 50; k++) { const c = (a + b) / 2; if (herm(t, i, c) >= T) b = c; else a = c; }
        return b;
      }
    }
    return t.ys[t.n - 1] >= T ? t.xs[t.n - 1] : null;
  }

  const TECHS = D.techs.map(prep);
  const BYID = new Map(TECHS.map(t => [t.id, t]));
  const CURVES = TECHS.filter(t => !t.isEvent);   // technologies with a usage line
  const EVENTS = TECHS.filter(t => t.isEvent);    // discoveries and firsts, shown as markers
  const AGES = D.ages || [];
  const HUMAN = D.human || [];
  const ageAt = y => AGES.find(a => y >= a.from && y < a.to) || (y >= NOW - 1 ? AGES[AGES.length - 1] : null);
  const SM = '✦';                                  // mental-shift mark
  const LM = '▽';                                  // lost know-how mark

  // cumulative culture: what each invention was built on, and what it led to
  TECHS.forEach(t => { t.onT = (t.on || []).map(id => BYID.get(id)).filter(Boolean); t.led = []; });
  TECHS.forEach(t => t.onT.forEach(p => p.led.push(t)));
  TECHS.forEach(t => t.led.sort((a, b) => a.first - b.first));
  const LOSSES = (D.losses || []).map(l => Object.assign({}, l, {
    isLoss: true, first: l.year, origin: l.year, end: l.regained == null ? l.year : l.regained,
    techsT: l.techs.map(id => BYID.get(id)).filter(Boolean)
  }));
  const LOSSBYID = new Map(LOSSES.map(l => [l.id, l]));
  TECHS.forEach(t => { t.losses = LOSSES.filter(l => l.techs.includes(t.id)); });
  const POP = D.pop || [];
  function ancestors(t) {
    const seen = new Set();
    const walk = u => { for (const p of u.onT) if (!seen.has(p)) { seen.add(p); walk(p); } };
    walk(t);
    return seen;
  }
  const depthMemo = new Map();
  function depth(t) {
    if (depthMemo.has(t)) return depthMemo.get(t);
    const d = t.onT.length ? 1 + Math.max(...t.onT.map(depth)) : 0;
    depthMemo.set(t, d);
    return d;
  }
  // the technologies a selection points to: an invention's prerequisites, or what a loss took away
  const kinOf = sel => !sel ? [] : sel.isLoss ? sel.techsT : sel.onT;

  /* ---------------- formatting ---------------- */

  const nf = new Intl.NumberFormat('en-US');
  const trim = (v, dp) => nf.format(parseFloat(v.toFixed(dp)));
  function sig(v, s) { if (v <= 0) return 0; const p = Math.pow(10, Math.floor(Math.log10(v)) - s + 1); return Math.round(v / p) * p; }

  function fmtYear(y, approx) {
    const bp = NOW - y;
    // deep-time entries are written as "years ago" (never a round calendar year); round BCE years stay BCE
    if ((bp >= 12000 && (approx || y % 100 !== 0)) || (!approx && y < 1500 && !Number.isInteger(y))) {
      const b = approx ? sig(bp, 2) : Math.round(bp);
      if (b >= 1e6) return trim(b / 1e6, 2) + ' million years ago';
      return nf.format(b) + ' years ago';
    }
    let r;
    if (y >= 1500) r = Math.floor(y);
    else if (approx && y < -1000) r = Math.round(y / 100) * 100;
    else if (approx && y < 1000) r = Math.round(y / 10) * 10;
    else r = Math.round(y);
    if (r < 1) return (r === 0 ? '1' : -r >= 10000 ? nf.format(-r) : String(-r)) + ' BCE';
    if (r < 1000) return r + ' CE';
    return String(r);
  }
  function fmtDur(n) {
    let r;
    if (n >= 10000) r = sig(n, 2);
    else if (n >= 1000) r = Math.round(n / 100) * 100;
    else if (n >= 200) r = Math.round(n / 10) * 10;
    else r = Math.max(1, Math.round(n));
    return nf.format(r) + (r === 1 ? ' year' : ' years');
  }
  function fmtPct(v) {
    if (v <= 0) return '0%';
    if (v < 0.1) return '<0.1%';
    if (v >= 99.5) return '100%';
    if (v < 10) return trim(v, 1) + '%';
    return Math.round(v) + '%';
  }
  function tickLabel(y) {
    const bp = NOW - y;
    if (bp >= 12000) return bp >= 1e6 ? trim(sig(bp, 2) / 1e6, 1) + 'M years ago' : trim(sig(bp, 2) / 1e3, 0) + 'k years ago';
    const r = Math.round(y);
    if (r < 1) return (r === 0 ? 1 : -r) + ' BCE';
    if (r < 1000) return r + ' CE';
    return String(r);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lk = cat => `<i class="lk" style="--c:var(--c-${cat})"></i>`;
  const sinceOrigin = (t, yr) => fmtDur(yr - t.origin);
  const countryNote = t => t.measure === 'country' ? ' Counted by country, so it jumps when a big country joins.' : t.measure === 'energy' ? ' Measured as a share of world energy, not of people.' : '';
  const neverReached = t => t.declining || t.end < NOW - 2;

  /* ---------------- state ---------------- */

  const PRESETS = [
    { id: 'all', label: 'All time', dom: [YMIN, NOW], scale: 'log' },
    { id: '100k', label: '100,000 years', dom: [NOW - 100000, NOW], scale: 'log' },
    { id: 'farm', label: 'Since farming', dom: [-11000, NOW], scale: 'log' },
    { id: 'ce', label: 'Since 1 CE', dom: [1, NOW], scale: 'log' },
    { id: 'ind', label: 'Since 1750', dom: [1750, NOW], scale: 'lin' },
    { id: '1900', label: 'Since 1900', dom: [1900, NOW], scale: 'lin' }
  ];

  const S = {
    view: 'curves', scope: 'key', scale: 'log', dom: [YMIN, NOW],
    cats: new Set(CATS.map(c => c.id)), sel: null, hover: null, hy: null,
    rsort: 'origin', thr: 50, snapAll: false, tsort: { k: 'origin', dir: 1 }, tq: ''
  };
  try {
    const saved = JSON.parse(localStorage.getItem('human-inventions') || '{}');
    if (saved.view === 'rows' || saved.view === 'curves') S.view = saved.view;
    if (['all', 'key', 'shift'].includes(saved.scope)) S.scope = saved.scope;
  } catch (e) { /* storage unavailable */ }
  const remember = () => { try { localStorage.setItem('human-inventions', JSON.stringify({ view: S.view, scope: S.scope })); } catch (e) { /* ignore */ } };

  const $ = id => document.getElementById(id);
  const fig = $('fig'), cv = $('cv'), rowsEl = $('rows'), rax = $('rax'), rsc = $('rsc'), rcv = $('rcv');
  const tip = $('tip'), emptyEl = $('empty');

  let COL = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue(n).trim();
    COL = { bg: g('--bg'), surface: g('--surface'), ink: g('--ink'), ink2: g('--ink-2'), muted: g('--muted'), grid: g('--grid'), axis: g('--axis'), wash: g('--wash') };
    CATS.forEach(c => { COL[c.id] = g('--c-' + c.id); });
  }

  /* ---------------- scales & ticks ---------------- */

  const F = { log: y => -Math.log10(OFF + NOW - y), lin: y => y };
  const FI = { log: u => NOW + OFF - Math.pow(10, -u), lin: u => u };

  function xscale(dom, L, R, scale) {
    const f = F[scale], fi = FI[scale];
    const u0 = f(dom[0]), u1 = f(dom[1]), k = (R - L) / (u1 - u0);
    return { x: y => L + (f(y) - u0) * k, inv: px => fi(u0 + (px - L) / k), L, R, u0, u1 };
  }

  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const r = raw / p;
    return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * p;
  }

  const DEEP = [[3e6, 0], [2e6, 2], [1e6, 0], [5e5, 2], [3e5, 1], [2e5, 2], [1e5, 0], [5e4, 1], [3e4, 2], [2e4, 1]];
  const CAL = [[-8000, 1], [-6000, 2], [-5000, 1], [-4000, 2], [-3000, 1], [-2000, 1], [-1000, 1], [1, 0], [500, 2], [1000, 1],
    [1200, 3], [1400, 2], [1500, 1], [1600, 2], [1700, 2], [1800, 1], [1850, 2], [1900, 0], [1925, 3], [1950, 1], [1975, 2],
    [2000, 0], [2010, 2], [2020, 1]];

  function xticks(sc, dom, ctx, W) {
    const [y0, y1] = dom;
    const c = [];
    const add = (y, p) => { if (y >= y0 - 1e-6 && y <= y1 + 1e-6) c.push({ y, p }); };
    DEEP.forEach(([b, p]) => add(NOW - b, p));
    CAL.forEach(([y, p]) => add(y, p));
    const target = Math.max(2, (sc.R - sc.L) / 110);
    const bpHi = NOW - y0, bpLo = Math.max(NOW - y1, 12000);
    if (bpHi > bpLo) {
      const st = niceStep((bpHi - bpLo) / target);
      for (let b = Math.ceil(bpLo / st) * st; b <= bpHi; b += st) add(NOW - b, 3);
    }
    const ya = Math.max(y0, NOW - 12000), yb = y1;
    if (yb > ya) {
      const st = Math.max(1, niceStep((yb - ya) / target));
      for (let y = Math.ceil(ya / st) * st; y <= yb; y += st) add(y === 0 ? 1 : y, 3);
    }
    c.sort((a, b) => a.p - b.p || b.y - a.y);
    const placed = [];
    for (const t of c) {
      const px = sc.x(t.y);
      const s = tickLabel(t.y);
      const w = ctx.measureText(s).width;
      const a = px - w / 2 - 8, b = px + w / 2 + 8;
      if (px - w / 2 < 2 || px + w / 2 > W - 2) continue;
      if (placed.some(o => !(b < o.a || a > o.b))) continue;
      placed.push({ px, s, a, b, y: t.y });
    }
    return placed.sort((a, b) => a.px - b.px);
  }

  /* ---------------- canvas helpers ---------------- */

  function fit(canvas, w, h) {
    const r = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.max(1, Math.round(w * r)), H = Math.max(1, Math.round(h * r));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(r, 0, 0, r, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return ctx;
  }
  const FONT = (px, w) => `${w || 400} ${px}px Inter, system-ui, -apple-system, "Segoe UI", sans-serif`;

  function haloText(ctx, s, x, y) {
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = COL.bg;
    ctx.strokeText(s, x, y);
    ctx.fillText(s, x, y);
  }

  /* ---------------- selection of what to draw ---------------- */

  const catOn = t => S.cats.has(t.cat);
  const inScope = t => S.scope === 'all' || (S.scope === 'key' ? t.key : !!t.shift);
  function chartTechs() {
    const list = CURVES.filter(t => catOn(t) && inScope(t));
    if (S.sel && !S.sel.isEvent && !S.sel.isLoss && !list.includes(S.sel)) list.push(S.sel);
    for (const k of kinOf(S.sel)) if (!k.isEvent && !list.includes(k)) list.push(k);
    return list;
  }
  function eventTechs() {
    const list = EVENTS.filter(t => catOn(t) && (S.scope !== 'shift' || t.shift));
    if (S.sel && S.sel.isEvent && !list.includes(S.sel)) list.push(S.sel);
    for (const k of kinOf(S.sel)) if (k.isEvent && !list.includes(k)) list.push(k);
    return list;
  }
  function lossList() {
    const list = LOSSES.filter(l => l.techsT.some(catOn));
    if (S.sel && S.sel.isLoss && !list.includes(S.sel)) list.push(S.sel);
    return list;
  }
  function rowTechs() {
    const list = [...chartTechs(), ...eventTechs()];
    const lat = t => t.latest == null ? -1 : t.latest;
    const by = {
      origin: (a, b) => a.origin - b.origin,
      cat: (a, b) => CATI[a.cat] - CATI[b.cat] || a.origin - b.origin,
      latest: (a, b) => lat(b) - lat(a) || a.origin - b.origin,
      speed: (a, b) => (a.cross[25] == null ? 1e12 : a.cross[25] - a.origin) - (b.cross[25] == null ? 1e12 : b.cross[25] - b.origin)
    }[S.rsort];
    return list.sort(by);
  }

  /* ---------------- main chart: curves ---------------- */

  let G = null;          // last geometry of the active view
  let curveList = [];

  function drawCurves() {
    const W = fig.clientWidth, H = fig.clientHeight;
    if (!W || !H) return;
    const narrow = W < 520;
    const L = narrow ? 38 : 46, R = W - (narrow ? 10 : 16), T = 50, B = H - 30;
    const AGE_Y = 9, EV_Y = 31;
    const ctx = fit(cv, W, H);
    const sc = xscale(S.dom, L, R, S.scale);
    const yv = v => B - v / 100 * (B - T);
    G = { kind: 'curves', W, H, L, R, T, B, sc, yv, EV_Y, evs: [] };

    drawAges(ctx, sc, L, R, 0, B, AGE_Y);

    // grid and axes
    ctx.font = FONT(12);
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1;
    const tks = xticks(sc, S.dom, ctx, W);
    ctx.strokeStyle = COL.grid;
    ctx.beginPath();
    tks.forEach(t => { const x = Math.round(t.px) + 0.5; ctx.moveTo(x, T); ctx.lineTo(x, B); });
    [20, 40, 60, 80, 100].forEach(v => { const y = Math.round(yv(v)) + 0.5; ctx.moveTo(L, y); ctx.lineTo(R, y); });
    ctx.stroke();
    ctx.strokeStyle = COL.axis;
    ctx.beginPath();
    ctx.moveTo(L, Math.round(B) + 0.5);
    ctx.lineTo(R, Math.round(B) + 0.5);
    ctx.stroke();
    ctx.fillStyle = COL.muted;
    ctx.textAlign = 'right';
    [0, 20, 40, 60, 80, 100].forEach(v => ctx.fillText(v + '%', L - 6, yv(v)));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    tks.forEach(t => ctx.fillText(t.s, t.px, B + 9));

    drawHumanLines(ctx, sc, T, B);
    curveList = chartTechs();

    const emph = [S.sel, S.hover].filter(t => t && !t.isEvent && !t.isLoss);
    const kin = kinOf(S.sel).filter(k => !k.isEvent && !emph.includes(k));
    const base = S.scope === 'all' ? 0.55 : 0.9;
    const dim = emph.length || kin.length ? 0.14 : base;
    if (S.sel && S.sel.isLoss) lossBand(ctx, sc, S.sel, L, R, T, B);
    const lw = S.scope === 'all' ? 1.5 : 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(L, T - 4, R - L, B - T + 8);
    ctx.clip();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    for (const t of curveList) {
      if (emph.includes(t)) continue;
      if (tracePath(ctx, t, sc, yv, L, R)) {
        const k = kin.includes(t);
        ctx.globalAlpha = k ? 0.85 : dim;
        ctx.strokeStyle = COL[t.cat];
        ctx.lineWidth = k ? 2.25 : lw;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    for (const t of emph) {
      if (!tracePath(ctx, t, sc, yv, L, R)) continue;
      ctx.strokeStyle = COL.bg;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.strokeStyle = COL[t.cat];
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();

    drawCurveLabels(ctx, sc, yv, L, R, T, B, emph, kin);
    drawHumanLabels(ctx, sc, T, R);
    drawEventLane(ctx, sc, L, R, EV_Y, B);

    // time cursor
    if (S.hy != null && S.hy >= S.dom[0] && S.hy <= S.dom[1]) {
      const x = Math.round(sc.x(S.hy)) + 0.5;
      ctx.strokeStyle = COL.ink;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, T);
      ctx.lineTo(x, B);
      ctx.stroke();
      ctx.globalAlpha = 1;
      cursorPill(ctx, x, B + 3, fmtYear(S.hy, true), W);
      if (S.hover && !S.hover.isEvent) {
        const v = val(S.hover, S.hy);
        if (v >= 0 && S.hy <= S.hover.end) dotAt(ctx, x, yv(v), COL[S.hover.cat], 5);
      }
    }
  }

  // ages of technology as alternating bands, names in the top lane
  function drawAges(ctx, sc, L, R, top, bottom, labelY) {
    ctx.save();
    ctx.font = FONT(12, 500);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    AGES.forEach((a, i) => {
      const x0 = Math.max(L, sc.x(Math.max(a.from, S.dom[0]))), x1 = Math.min(R, sc.x(Math.min(a.to, S.dom[1])));
      if (x1 <= x0) return;
      if (i % 2 === 1) {
        ctx.fillStyle = COL.wash;
        ctx.fillRect(x0, top, x1 - x0, bottom - top);
      }
      if (i > 0 && a.from >= S.dom[0] && a.from <= S.dom[1]) {
        ctx.fillStyle = COL.axis;
        ctx.fillRect(Math.round(x0), top, 1, 18);
      }
      let s = a.name;
      if (ctx.measureText(s).width > x1 - x0 - 10) s = a.short;
      if (ctx.measureText(s).width > x1 - x0 - 10) return;
      ctx.fillStyle = COL.muted;
      ctx.fillText(s, (x0 + x1) / 2, labelY);
    });
    ctx.restore();
  }
  // first members of our genus and of our species
  function drawHumanLines(ctx, sc, top, bottom) {
    HUMAN.forEach(h => {
      if (h.year < S.dom[0] || h.year > S.dom[1]) return;
      const x = Math.round(sc.x(h.year)) + 0.5;
      ctx.strokeStyle = COL.ink;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }
  function drawHumanLabels(ctx, sc, top, R) {
    ctx.font = FONT(12, 600);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COL.ink2;
    const boxes = [];
    HUMAN.forEach(h => {
      if (h.year < S.dom[0] || h.year > S.dom[1]) return;
      const x = sc.x(h.year), w = ctx.measureText(h.name).width;
      const right = x + 6 + w < R;
      const x0 = right ? x + 6 : x - 6 - w;
      let y = top + 10;
      while (boxes.some(b => b.y === y && !(x0 + w + 4 < b.x0 || x0 > b.x1 + 4))) y += 16;
      boxes.push({ x0, x1: x0 + w, y });
      ctx.textAlign = right ? 'left' : 'right';
      haloText(ctx, h.name, right ? x + 6 : x - 6, y);
    });
  }
  function diamondPath(ctx, x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
  }
  function diamond(ctx, x, y, r, color, ring) {
    diamondPath(ctx, x, y, r + 2);
    ctx.fillStyle = COL.bg;
    ctx.fill();
    diamondPath(ctx, x, y, r);
    ctx.fillStyle = color;
    ctx.fill();
    if (ring) {
      diamondPath(ctx, x, y, r + 4);
      ctx.strokeStyle = COL.ink;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  // discoveries and firsts: diamonds on their own lane above the plot
  function lossBand(ctx, sc, l, L, R, T, B) {
    const a = Math.max(L, sc.x(Math.max(l.year, S.dom[0])));
    const b = Math.min(R, sc.x(Math.min(l.regained == null ? NOW : l.regained, S.dom[1])));
    if (b <= a) return;
    ctx.fillStyle = COL.ink;
    ctx.globalAlpha = 0.07;
    ctx.fillRect(a, T, Math.max(2, b - a), B - T);
    ctx.globalAlpha = 1;
  }
  function lossMark(ctx, x, y, r, filled) {
    ctx.beginPath();
    ctx.moveTo(x - r, y - r * 0.75);
    ctx.lineTo(x + r, y - r * 0.75);
    ctx.lineTo(x, y + r);
    ctx.closePath();
    ctx.fillStyle = filled ? COL.ink : COL.bg;
    ctx.fill();
    ctx.strokeStyle = COL.ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  function drawEventLane(ctx, sc, L, R, y, B) {
    const inDom = t => t.first >= S.dom[0] && t.first <= S.dom[1];
    const evs = eventTechs().filter(inDom);
    const losses = lossList().filter(inDom);
    G.evs = [...evs, ...losses].map(t => ({ t, x: sc.x(t.first) }));
    for (const l of losses) if (l !== S.sel && l !== S.hover) lossMark(ctx, sc.x(l.first), y, 5, false);
    const focus = [S.sel, S.hover].filter(t => t && (t.isEvent || t.isLoss) && inDom(t));
    for (const t of focus) {
      const x = Math.round(sc.x(t.first)) + 0.5;
      ctx.strokeStyle = COL.ink;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + 8);
      ctx.lineTo(x, B);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    for (const o of G.evs) if (!focus.includes(o.t) && !o.t.isLoss) diamond(ctx, o.x, y, 5, COL[o.t.cat], false);
    ctx.font = FONT(12, 600);
    ctx.textBaseline = 'middle';
    for (const t of focus) {
      const x = sc.x(t.first);
      if (t.isLoss) lossMark(ctx, x, y, 6, true); else diamond(ctx, x, y, 6, COL[t.cat], t === S.sel);
      const w = ctx.measureText(t.name).width;
      const right = x + 14 + w < R;
      ctx.textAlign = right ? 'left' : 'right';
      ctx.fillStyle = COL.ink;
      haloText(ctx, t.name, right ? x + 14 : x - 14, y);
    }
  }

  function cursorPill(ctx, x, y, s, W) {
    ctx.font = FONT(12, 600);
    const w = ctx.measureText(s).width + 14;
    const px = Math.max(2, Math.min(W - w - 2, x - w / 2));
    ctx.fillStyle = COL.ink;
    roundRect(ctx, px, y, w, 22, 6);
    ctx.fill();
    ctx.fillStyle = COL.bg;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s, px + 7, y + 11.5);
    ctx.font = FONT(12);
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function dotAt(ctx, x, y, color, r) {
    ctx.beginPath();
    ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    ctx.fillStyle = COL.bg;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // builds a path for one curve over its visible span; returns false if off screen
  function tracePath(ctx, t, sc, yv, L, R) {
    const y0 = Math.max(t.origin, S.dom[0]), y1 = Math.min(t.end, S.dom[1]);
    if (y1 <= y0) return false;
    const xa = sc.x(y0), xb = sc.x(y1);
    ctx.beginPath();
    let first = true;
    for (let px = xa; ; px = Math.min(px + 2, xb)) {
      const last = px >= xb;
      const yr = last ? y1 : px === xa ? y0 : sc.inv(px);
      const v = val(t, yr);
      const py = yv(v < 0 ? 0 : v);
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
      if (last) break;
    }
    return true;
  }

  function drawCurveLabels(ctx, sc, yv, L, R, T, B, emph, kin) {
    let cands = curveList.filter(t => emph.includes(t) || kin.includes(t) || t.key || S.scope === 'shift');
    const rising = t => t.halfPeak != null && t.halfPeak >= S.dom[0] && t.halfPeak <= S.dom[1];
    const lit = t => emph.includes(t) || kin.includes(t);
    cands = [...emph, ...kin, ...cands.filter(t => !lit(t)).sort((a, b) => rising(b) - rising(a) || b.peak - a.peak)];
    const placed = [];
    ctx.font = FONT(12, 500);
    ctx.textBaseline = 'middle';
    for (const t of cands) {
      const a = anchor(t, sc);
      if (!a) continue;
      const ax = sc.x(a.y), ay = yv(a.v);
      const s = t.name;
      const w = ctx.measureText(s).width;
      const tries = [[ax + 8, ay - 10, 'left'], [ax - 8, ay - 10, 'right'], [ax + 8, ay + 11, 'left'], [ax - 8, ay + 11, 'right']];
      const dot = { x0: ax - 6, x1: ax + 6, y0: ay - 6, y1: ay + 6 };
      const hit = b => placed.some(o => !(b.x1 < o.x0 || b.x0 > o.x1 || b.y1 < o.y0 || b.y0 > o.y1));
      if (hit(dot)) continue;
      for (const [tx, ty, al] of tries) {
        const x0 = al === 'left' ? tx : tx - w, x1 = x0 + w;
        if (x0 < L + 2 || x1 > R - 2 || ty < T + 6 || ty > B - 6) continue;
        const box = { x0: x0 - 3, x1: x1 + 3, y0: ty - 8, y1: ty + 8 };
        if (hit(box)) continue;
        placed.push(box, dot);
        dotAt(ctx, ax, ay, COL[t.cat], 3.5);
        ctx.textAlign = al;
        ctx.fillStyle = COL.ink;
        ctx.globalAlpha = (emph.length || kin.length) && !lit(t) ? 0.55 : 1;
        haloText(ctx, s, tx, ty);
        ctx.globalAlpha = 1;
        break;
      }
    }
  }

  // where along a curve its label sits: where it first reaches half its peak, if visible
  function anchor(t, sc) {
    const y0 = Math.max(t.origin, S.dom[0]), y1 = Math.min(t.end, S.dom[1]);
    if (y1 <= y0) return null;
    let y = t.halfPeak;
    if (y == null || y < y0 || y > y1) {
      // the rise is off screen: spread fallback labels along the visible span so they don't stack
      const x0 = sc.x(y0), x1 = sc.x(y1);
      if (x1 - x0 < 6) return null;
      const f = 0.12 + 0.76 * ((TECHS.indexOf(t) * 0.6180339) % 1);
      y = sc.inv(x0 + (x1 - x0) * f);
    }
    const v = val(t, y);
    return v < 0 ? null : { y, v };
  }

  /* ---------------- main chart: rows ---------------- */

  let rowList = [];
  let scrollRowSel = false;
  function drawRows() {
    const W = rsc.clientWidth, Hv = fig.clientHeight;
    if (!W || !Hv) return;
    const narrow = W < 520;
    const ROW = narrow ? 24 : 26;
    const L = narrow ? 112 : 176, R = W - (narrow ? 10 : 16);
    rowList = rowTechs();
    const H = rowList.length * ROW + 8;
    const sc = xscale(S.dom, L, R, S.scale);
    G = { kind: 'rows', W, H, L, R, ROW, sc };

    // axis strip: ages on top, time ticks below
    const actx = fit(rax, fig.clientWidth, 48);
    drawAges(actx, sc, L, R, 0, 48, 10);
    actx.font = FONT(12);
    const tks = xticks(sc, S.dom, actx, W);
    actx.fillStyle = COL.muted;
    actx.textAlign = 'center';
    actx.textBaseline = 'middle';
    tks.forEach(t => actx.fillText(t.s, t.px, 34));
    actx.textAlign = 'left';
    actx.fillText(narrow ? 'Share of people' : 'Share of all people', 0, 34);
    if (S.hy != null && S.hy >= S.dom[0] && S.hy <= S.dom[1]) cursorPill(actx, sc.x(S.hy), 23, fmtYear(S.hy, true), W);

    const ctx = fit(rcv, W, H);
    AGES.forEach((a, i) => {
      if (i % 2 !== 1) return;
      const x0 = Math.max(L, sc.x(Math.max(a.from, S.dom[0]))), x1 = Math.min(R, sc.x(Math.min(a.to, S.dom[1])));
      if (x1 > x0) { ctx.fillStyle = COL.wash; ctx.fillRect(x0, 0, x1 - x0, H); }
    });
    drawHumanLines(ctx, sc, 0, H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = COL.grid;
    ctx.beginPath();
    tks.forEach(t => { const x = Math.round(t.px) + 0.5; ctx.moveTo(x, 0); ctx.lineTo(x, H); });
    ctx.stroke();

    ctx.textBaseline = 'middle';
    rowList.forEach((t, i) => {
      const top = 4 + i * ROW, base = top + ROW - 4, hgt = ROW - 7;
      const on = t === S.sel, hov = t === S.hover;
      if (on || hov) {
        ctx.fillStyle = COL.wash;
        ctx.fillRect(0, top, W, ROW);
      }
      ctx.strokeStyle = COL.grid;
      ctx.beginPath();
      ctx.moveTo(L, base + 0.5);
      ctx.lineTo(R, base + 0.5);
      ctx.stroke();
      // name
      ctx.font = FONT(narrow ? 12 : 13, on ? 600 : 400);
      ctx.fillStyle = on || hov ? COL.ink : COL.ink2;
      ctx.textAlign = 'left';
      ctx.fillText(ellipsize(ctx, t.name + (t.shift ? ' ' + SM : ''), L - 14), 0, top + ROW / 2);
      if (t.isEvent) {
        if (t.first >= S.dom[0] && t.first <= S.dom[1]) diamond(ctx, sc.x(t.first), top + ROW / 2, 5, COL[t.cat], on);
        return;
      }
      // area
      const y0 = Math.max(t.origin, S.dom[0]), y1 = Math.min(t.end, S.dom[1]);
      if (y1 > y0) {
        const xa = sc.x(y0), xb = sc.x(y1);
        ctx.beginPath();
        ctx.moveTo(xa, base);
        for (let px = xa; ; px = Math.min(px + 2, xb)) {
          const last = px >= xb;
          const yr = last ? y1 : px === xa ? y0 : sc.inv(px);
          const v = Math.max(0, val(t, yr));
          ctx.lineTo(px, base - v / 100 * hgt);
          if (last) break;
        }
        ctx.lineTo(xb, base);
        ctx.closePath();
        ctx.fillStyle = COL[t.cat];
        ctx.globalAlpha = on || hov ? 0.4 : 0.22;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.beginPath();
        ctx.rect(xa - 1, top, xb - xa + 2, ROW);
        ctx.clip();
        tracePath(ctx, t, sc, v => base - v / 100 * hgt, L, R);
        ctx.strokeStyle = COL[t.cat];
        ctx.lineWidth = on || hov ? 2 : 1.5;
        ctx.stroke();
        ctx.restore();
      }
      if (t.origin >= S.dom[0] && t.origin <= S.dom[1]) dotAt(ctx, sc.x(t.origin), base, COL[t.cat], 3);
      for (const l of t.losses) if (l.year >= S.dom[0] && l.year <= S.dom[1]) lossMark(ctx, sc.x(l.year), top + 7, 4, l === S.sel);
    });

    drawHumanLabels(ctx, sc, 0, R);
    if (scrollRowSel && S.sel) {
      scrollRowSel = false;
      const i = rowList.indexOf(S.sel);
      const top = 4 + i * ROW;
      if (i >= 0 && (top < rsc.scrollTop || top + ROW > rsc.scrollTop + rsc.clientHeight)) rsc.scrollTop = Math.max(0, top - rsc.clientHeight / 3);
    }
    if (S.hy != null && S.hy >= S.dom[0] && S.hy <= S.dom[1]) {
      const x = Math.round(sc.x(S.hy)) + 0.5;
      ctx.strokeStyle = COL.ink;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  function ellipsize(ctx, s, max) {
    if (ctx.measureText(s).width <= max) return s;
    let lo = 0, hi = s.length;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ctx.measureText(s.slice(0, mid) + '…').width <= max) lo = mid; else hi = mid; }
    return s.slice(0, lo).trimEnd() + '…';
  }

  /* ---------------- render loop ---------------- */

  let raf = 0;
  function draw() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const none = S.cats.size === 0;
      emptyEl.hidden = !none;
      if (S.view === 'curves') drawCurves(); else drawRows();
      renderSnap();
      syncPresets();
    });
  }

  /* ---------------- interaction on the chart ---------------- */

  function plotPx(e) {
    const el = S.view === 'curves' ? cv : rcv;
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function hoverAt(e) {
    if (!G) return;
    const p = plotPx(e);
    const { sc, L, R } = G;
    if (p.x < L || p.x > R) { S.hy = null; S.hover = null; hideTip(); draw(); return; }
    const yr = sc.inv(p.x);
    S.hy = yr;
    let best = null;
    if (G.kind === 'curves' && p.y < G.T - 6) {
      let bd = 12;
      for (const o of G.evs) { const d = Math.abs(o.x - p.x); if (d < bd) { bd = d; best = o.t; } }
    } else if (G.kind === 'curves') {
      let bd = 12;
      for (const t of curveList) {
        if (yr < t.origin || yr > t.end) continue;
        const dy = Math.abs(G.yv(val(t, yr)) - p.y);
        if (dy < bd || (dy === bd && t === S.sel)) { bd = dy; best = t; }
      }
    } else {
      const i = Math.floor((p.y - 4) / G.ROW);
      best = rowList[i] || null;
    }
    S.hover = best;
    showTip(e, best, yr);
    draw();
  }

  function showTip(e, t, yr) {
    if (!t) { hideTip(); return; }
    const v = val(t, yr);
    if (t.isLoss) {
      tip.innerHTML = `<div class="tv">${esc(fmtYear(t.year))}</div><div class="tn">${LM} ${esc(t.name)}</div><div class="ty">Know-how lost, ${esc(t.where)}${t.regained == null ? '' : `; regained ${esc(fmtYear(t.regained, true))}`}</div>`;
      placeTip(e);
      return;
    }
    if (t.isEvent) {
      tip.innerHTML = `<div class="tv">${esc(fmtYear(t.first))}</div><div class="tn">${lk(t.cat)}${esc(t.name)}${t.shift ? ' ' + SM : ''}</div><div class="ty">Discovery or first, ${esc(t.where)}</div>`;
      placeTip(e);
      return;
    }
    const before = v < 0;
    const after = yr > t.end;
    tip.innerHTML = before
      ? `<div class="tn">${lk(t.cat)}${esc(t.name)}</div><div class="ty">Not yet: first evidence ${esc(fmtYear(t.first))}</div>`
      : `<div class="tv">${fmtPct(v)}</div><div class="tn">${lk(t.cat)}${esc(t.name)}${t.shift ? ' ' + SM : ''}</div><div class="ty">${after ? 'latest data, ' + esc(fmtYear(t.end)) : 'in ' + esc(fmtYear(yr, true))}</div>`;
    placeTip(e);
  }
  function placeTip(e) {
    tip.hidden = false;
    const fr = fig.getBoundingClientRect();
    let x = e.clientX - fr.left + 14, y = e.clientY - fr.top + 14;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    if (x + tw > fr.width - 4) x = e.clientX - fr.left - tw - 14;
    if (y + th > fr.height - 4) y = e.clientY - fr.top - th - 14;
    tip.style.transform = `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
  }
  function hideTip() { tip.hidden = true; }

  function clickAt(e) {
    hoverAt(e);
    select(S.hover && S.hover !== S.sel ? S.hover : S.hover ? S.sel : null);
  }

  // zoom and pan work in transformed (log or linear) coordinates
  function setU(u0, u1) {
    const f = F[S.scale], fi = FI[S.scale];
    const UMIN = f(YMIN), UMAX = f(NOW);
    if (u1 - u0 >= UMAX - UMIN) { u0 = UMIN; u1 = UMAX; }
    else {
      if (u0 < UMIN) { u1 += UMIN - u0; u0 = UMIN; }
      if (u1 > UMAX) { u0 -= u1 - UMAX; u1 = UMAX; }
    }
    const y0 = fi(u0), y1 = Math.min(NOW, fi(u1));
    if (y1 - y0 < 4) return;
    S.dom = [y0, y1];
    draw();
  }
  function zoomAt(px, factor) {
    if (!G) return;
    const { sc } = G;
    const uc = sc.u0 + (px - sc.L) / (sc.R - sc.L) * (sc.u1 - sc.u0);
    setU(uc - (uc - sc.u0) * factor, uc + (sc.u1 - uc) * factor);
  }
  function panPx(dx, start) {
    if (!G) return;
    const span = start.u1 - start.u0;
    const du = -dx / (G.sc.R - G.sc.L) * span;
    setU(start.u0 + du, start.u1 + du);
  }

  const ptrs = new Map();
  let drag = null, pinch = null;
  function bindChart(el) {
    el.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      ptrs.set(e.pointerId, e.clientX);
      if (ptrs.size === 1 && G) drag = { x0: e.clientX, y0: e.clientY, u0: G.sc.u0, u1: G.sc.u1, moved: false, id: e.pointerId };
      if (ptrs.size === 2 && G) {
        const xs = [...ptrs.values()];
        pinch = { d0: Math.abs(xs[0] - xs[1]) || 1, cx: (xs[0] + xs[1]) / 2, u0: G.sc.u0, u1: G.sc.u1 };
        drag = null;
      }
    });
    el.addEventListener('pointermove', e => {
      if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, e.clientX);
      if (pinch && ptrs.size === 2) {
        const xs = [...ptrs.values()];
        const d = Math.abs(xs[0] - xs[1]) || 1;
        const r = el.getBoundingClientRect();
        const px = pinch.cx - r.left;
        const uc = pinch.u0 + (px - G.sc.L) / (G.sc.R - G.sc.L) * (pinch.u1 - pinch.u0);
        const k = pinch.d0 / d;
        setU(uc - (uc - pinch.u0) * k, uc + (pinch.u1 - uc) * k);
        return;
      }
      if (drag && drag.id === e.pointerId) {
        const dx = e.clientX - drag.x0;
        if (!drag.moved && Math.abs(dx) > 5) {
          drag.moved = true;
          try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          fig.classList.add('dragging');
          hideTip();
        }
        if (drag.moved) { panPx(dx, drag); return; }
      }
      if (e.pointerType === 'mouse' || !drag) hoverAt(e);
    });
    const end = e => {
      const wasClick = drag && !drag.moved && drag.id === e.pointerId && e.type === 'pointerup';
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = null;
      if (wasClick) clickAt(e);
      if (!ptrs.size) { drag = null; fig.classList.remove('dragging'); }
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointerleave', e => {
      if (drag && drag.moved) return;
      if (e.pointerType === 'mouse') { S.hy = null; S.hover = null; hideTip(); draw(); }
    });
    el.addEventListener('wheel', e => {
      if (!G) return;
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        zoomAt(px, Math.exp(Math.max(-0.6, Math.min(0.6, dy * 0.008))));
      } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) {
        e.preventDefault();
        panPx(-e.deltaX, { u0: G.sc.u0, u1: G.sc.u1 });
      }
    }, { passive: false });
    el.addEventListener('dblclick', e => { const r = el.getBoundingClientRect(); zoomAt(e.clientX - r.left, 0.5); });
  }
  bindChart(cv);
  bindChart(rcv);
  bindChart(rax);

  fig.addEventListener('keydown', e => {
    if (!G) return;
    const mid = (G.sc.L + G.sc.R) / 2;
    const stepPx = (G.sc.R - G.sc.L) / 50;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const cur = S.hy == null ? mid : G.sc.x(S.hy);
      const nx = Math.max(G.sc.L, Math.min(G.sc.R, cur + (e.key === 'ArrowLeft' ? -stepPx : stepPx)));
      S.hy = G.sc.inv(nx);
      draw();
    } else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomAt(S.hy == null ? mid : G.sc.x(S.hy), 0.6); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomAt(S.hy == null ? mid : G.sc.x(S.hy), 1 / 0.6); }
    else if (e.key === 'Escape') { select(null); }
    else if (e.key === '0') { setPreset(PRESETS[0]); }
  });
  fig.addEventListener('blur', () => { if (!fig.matches(':hover')) { S.hy = null; draw(); } });

  /* ---------------- side panel ---------------- */

  const snapEl = $('snap'), detEl = $('details');
  function renderSnap() {
    const atHover = S.hy != null;
    const yr = atHover ? S.hy : Math.min(S.dom[1], NOW);
    const isNow = yr >= NOW - 1.5;
    const pool = CURVES.filter(t => catOn(t) && (S.scope !== 'shift' || t.shift));
    const items = pool.map(t => ({ t, v: val(t, yr) }))
      .filter(o => o.v >= 0.05)
      .sort((a, b) => b.v - a.v || a.t.origin - b.t.origin);
    const existed = pool.filter(t => t.origin <= yr).length;
    const top = S.sel ? 5 : 10;
    const lim = S.snapAll ? items.length : top;
    const title = isNow ? 'Today' : 'In ' + fmtYear(yr, true);
    const age = ageAt(yr);
    snapEl.innerHTML = `<h3><span>${atHover ? 'At the cursor' : isNow ? 'Latest data' : 'At the right edge'}</span><span class="sy">${esc(title)}</span></h3>`
      + `<p class="ss">${age ? `<strong>${esc(age.name)}.</strong> ` : ''}${existed} of ${pool.length} ${S.scope === 'shift' ? 'mental shifts' : 'technologies'} had appeared. Share of people using each:</p>`
      + (items.length ? `<ul class="slist">${items.slice(0, lim).map(o => `<li><button type="button" class="srow${o.t === S.sel ? ' on' : ''}" data-id="${o.t.id}" style="--c:var(--c-${o.t.cat})"><span class="nm">${lk(o.t.cat)}<span>${esc(o.t.name)}${o.t.shift ? ' ' + SM : ''}</span></span><span class="bar"><b style="width:${Math.max(1, o.v).toFixed(1)}%"></b></span><span class="v">${fmtPct(o.v)}</span></button></li>`).join('')}</ul>`
        : `<p class="ss" style="margin-top:10px">Nothing in use yet in the selected categories.</p>`)
      + (items.length > top ? `<button type="button" class="more" data-more>${S.snapAll ? `Show top ${top}` : `Show all ${items.length}`}</button>` : '');
  }
  snapEl.addEventListener('click', e => {
    const b = e.target.closest('[data-id]');
    if (b) { select(BYID.get(b.dataset.id), true); return; }
    if (e.target.closest('[data-more]')) { S.snapAll = !S.snapAll; renderSnap(); }
  });

  const chip = u => `<button type="button" class="chip-s" data-id="${u.id}">${lk(u.cat)}${esc(u.name)}</button>`;
  function renderDetails() {
    const t = S.sel;
    if (!t) { detEl.hidden = true; detEl.innerHTML = ''; return; }
    if (t.isLoss) {
      detEl.innerHTML = `<div class="dh"><div><h3>${esc(t.name)}</h3><div class="dc">${LM} Know-how lost</div></div>`
        + `<button type="button" class="x" data-close aria-label="Close details">×</button></div>`
        + `<p class="df">Lost around <strong>${esc(fmtYear(t.year))}</strong>, ${esc(t.where)}</p>`
        + `<p class="dd">${esc(t.desc)}</p>`
        + `<dl><dt>Why</dt><dd>${esc(t.cause)}</dd><dt>Regained</dt><dd>${t.regained == null ? 'Not regained' : esc(fmtYear(t.regained, true))}</dd></dl>`
        + `<div class="kin"><span class="kl">What was lost</span>${t.techsT.map(chip).join('')}</div>`
        + `<p class="dq">Joseph Henrich’s point: know-how lives in a population, not in individuals, and it can vanish when that population shrinks, is cut off or loses its experts. The global lines barely dip, because the skill survived elsewhere.</p>`;
      detEl.hidden = false;
      return;
    }
    const c = CATS[CATI[t.cat]];
    const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
    const reach = T => t.cross[T] != null
      ? `${esc(fmtYear(t.cross[T], true))} <span class="sub-inline">(after ${esc(sinceOrigin(t, t.cross[T]))})</span>`
      : neverReached(t) ? 'Never' : 'Not yet';
    const age = ageAt(t.first);
    detEl.innerHTML = `<div class="dh"><div><h3>${esc(t.name)}</h3><div class="dc">${lk(t.cat)}${esc(c.name)}${t.isEvent ? ' · discovery' : ''}</div></div>`
      + `<button type="button" class="x" data-close aria-label="Close details">×</button></div>`
      + `<p class="df">${t.isEvent ? 'Date' : 'First evidence'} <strong>${esc(fmtYear(t.first))}</strong>, ${esc(t.where)}</p>`
      + (t.by ? `<p class="df">First made by <strong>${esc(t.by)}</strong></p>` : '')
      + `<p class="dd">${esc(t.desc)}</p>`
      + (t.shift ? `<p class="shift"><strong>${SM} Mental shift.</strong> ${esc(t.shift)}</p>` : '')
      + (t.onT.length ? `<div class="kin"><span class="kl">Built on</span>${t.onT.map(chip).join('')}</div>` : '')
      + (t.led.length ? `<div class="kin"><span class="kl">Led to</span>${t.led.slice(0, 8).map(chip).join('')}${t.led.length > 8 ? `<span class="kl">and ${t.led.length - 8} more</span>` : ''}</div>` : '')
      + (t.losses.length ? `<div class="kin"><span class="kl">Lost</span>${t.losses.map(l => `<button type="button" class="chip-s" data-loss="${l.id}">${LM} ${esc(l.name)}, ${esc(fmtYear(l.year))}</button>`).join('')}</div>` : '')
      + (t.onT.length ? `<button type="button" class="more" data-tree="${t.id}">See its family tree</button>` : '')
      + (t.isEvent
        ? `<dl>${age ? row('Age', esc(age.name)) : ''}</dl><p class="dq">A discovery or first: it has a date but no usage line, because there is no sensible “share of people using it”.</p>`
        : `<dl>${age ? row('Age', esc(age.name)) : ''}${row('Latest', `${fmtPct(t.latest)} in ${esc(fmtYear(t.end))}`)}`
          + (t.declining ? row('Peak', `${fmtPct(t.peak)} around ${esc(fmtYear(t.peakYear, true))}`) : '')
          + row('Reached 10%', reach(10)) + row('Reached 50%', reach(50)) + row('Reached 90%', reach(90)) + '</dl>'
          + `<p class="dq">${QLABEL[t.q]}: ${QTEXT[t.q]}${countryNote(t)}</p>`);
    detEl.hidden = false;
  }
  detEl.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { select(null); return; }
    const c = e.target.closest('[data-id]');
    if (c) { select(BYID.get(c.dataset.id), true); return; }
    const l = e.target.closest('[data-loss]');
    if (l) { select(LOSSBYID.get(l.dataset.loss), true); return; }
    const tr = e.target.closest('[data-tree]');
    if (tr) { setTreeRoot(BYID.get(tr.dataset.tree)); $('brain').scrollIntoView({ behavior: smooth(), block: 'start' }); }
  });
  const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  function select(t, reveal) {
    S.sel = t || null;
    try {
      const url = location.pathname + location.search + (t && !t.isLoss ? '#' + t.id : '');
      history.replaceState(null, '', url);
    } catch (e) { /* sandboxed */ }
    if (t && reveal && (t.isEvent || t.isLoss)) {
      if (t.first < S.dom[0] || t.first > S.dom[1]) fitTo(t);
      scrollRowSel = true;
    } else if (t && reveal) {
      // refit unless the rise is on screen and wide enough to read
      const h = t.halfPeak;
      const riseEnd = Math.min(S.dom[1], t.cross[90] != null ? t.cross[90] : t.peakYear);
      const wide = G ? G.sc.x(riseEnd) - G.sc.x(Math.max(t.origin, S.dom[0])) > (G.sc.R - G.sc.L) * 0.12 : false;
      const visible = h != null && h >= S.dom[0] && h <= S.dom[1] && wide;
      if (!visible) fitTo(t);
      scrollRowSel = true;
    }
    renderDetails();
    renderTable();
    drawSpeed();
    draw();
  }

  // zoom so a technology's rise is in view
  function fitTo(t) {
    const f = F[S.scale];
    const a = Math.max(YMIN, t.origin - (NOW - t.origin) * 0.6);
    let u0 = f(a), u1 = f(NOW);
    if (S.scale === 'lin') { u0 = Math.max(f(YMIN), t.origin - Math.max(t.end - t.origin, (NOW - t.origin) * 0.5) * 0.3 - 5); }
    setU(u0, u1);
  }

  /* ---------------- controls ---------------- */

  function setPressed(group, value) {
    group.querySelectorAll('button[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(value))));
  }

  const viewEl = $('view'), scopeEl = $('scope'), scaleEl = $('scale'), presetsEl = $('presets');
  $('nall').textContent = TECHS.length;

  function applyView() {
    setPressed(viewEl, S.view);
    const rows = S.view === 'rows';
    cv.hidden = rows;
    rowsEl.hidden = !rows;
    $('sortg').hidden = !rows;
    $('cap').textContent = rows
      ? 'Every technology on its own row; height shows the share of all people using it'
      : 'Share of all people alive who used each technology';
    fig.setAttribute('aria-label', rows ? 'Adoption rows, one per technology. The table below lists every value.' : 'Adoption curves. The table below lists every value; arrow keys move the time cursor.');
    hint();
    draw();
  }
  function hint() {
    const touch = matchMedia('(pointer: coarse)').matches;
    $('hint').textContent = (touch
      ? 'Swipe sideways to move through time, use + and − to zoom, tap a line or a ◆ discovery for its story.'
      : 'Drag to move through time; pinch, Ctrl + scroll or double-click to zoom; click a line or a ◆ discovery for its story.')
      + (S.scale === 'log' ? ' Log time scale: each step left is about ten times further back.' : ' Linear time scale.')
      + ` ${SM} marks a mental shift; ${LM} marks know-how that was lost.`;
  }

  viewEl.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; S.view = b.dataset.v; remember(); S.hover = null; applyView(); });
  scopeEl.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; S.scope = b.dataset.v; remember(); setPressed(scopeEl, S.scope); S.snapAll = false; draw(); });
  scaleEl.addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; S.scale = b.dataset.v; setPressed(scaleEl, S.scale); hint(); draw(); });
  $('zoom').addEventListener('click', e => {
    const b = e.target.closest('button[data-z]');
    if (!b || !G) return;
    const px = S.hy != null && S.hy >= S.dom[0] ? G.sc.x(S.hy) : (G.sc.L + G.sc.R) / 2;
    zoomAt(px, b.dataset.z === 'in' ? 0.5 : 2);
  });
  $('rsort').addEventListener('change', e => { S.rsort = e.target.value; draw(); });

  presetsEl.innerHTML = PRESETS.map(p => `<button type="button" data-p="${p.id}" aria-pressed="false">${esc(p.label)}</button>`).join('');
  function setPreset(p) {
    S.scale = p.scale;
    setPressed(scaleEl, S.scale);
    S.dom = p.dom.slice();
    hint();
    draw();
  }
  presetsEl.addEventListener('click', e => { const b = e.target.closest('button[data-p]'); if (b) setPreset(PRESETS.find(p => p.id === b.dataset.p)); });
  function syncPresets() {
    presetsEl.querySelectorAll('button').forEach(b => {
      const p = PRESETS.find(x => x.id === b.dataset.p);
      const on = Math.abs(p.dom[0] - S.dom[0]) < Math.max(1, (S.dom[1] - S.dom[0]) * 1e-3) && Math.abs(p.dom[1] - S.dom[1]) < 1 && p.scale === S.scale;
      b.setAttribute('aria-pressed', String(on));
    });
  }

  // category legend = filter
  const legendEl = $('legend');
  function renderLegend() {
    const allOn = S.cats.size === CATS.length;
    legendEl.innerHTML = CATS.map(c => { const n = TECHS.filter(t => t.cat === c.id).length; return `<button type="button" class="chip" data-c="${c.id}" aria-pressed="${S.cats.has(c.id)}" title="${n} technologies. Shift-click to show only this category">${lk(c.id)}${esc(c.name)}</button>`; }).join('')
      + (allOn ? '' : `<button type="button" class="chip all" data-c="*" aria-pressed="true">Show all</button>`);
  }
  legendEl.addEventListener('click', e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const id = b.dataset.c;
    if (id === '*') CATS.forEach(c => S.cats.add(c.id));
    else if (e.shiftKey || e.altKey) { S.cats.clear(); S.cats.add(id); }
    else if (S.cats.has(id)) S.cats.delete(id); else S.cats.add(id);
    renderLegend();
    renderTable();
    drawSpeed();
    draw();
  });

  // find box
  const q = $('q'), qlist = $('qlist');
  let qItems = [], qIdx = 0;
  function renderFind() {
    const s = q.value.trim().toLowerCase();
    if (!s) { qlist.hidden = true; q.setAttribute('aria-expanded', 'false'); return; }
    const starts = TECHS.filter(t => t.name.toLowerCase().startsWith(s));
    const inName = TECHS.filter(t => !starts.includes(t) && t.name.toLowerCase().includes(s));
    const inText = TECHS.filter(t => !starts.includes(t) && !inName.includes(t) && t.search.includes(s));
    qItems = [...starts, ...inName, ...inText].slice(0, 8);
    qIdx = 0;
    qlist.innerHTML = qItems.length
      ? qItems.map((t, i) => `<li role="option" id="qo-${i}" data-id="${t.id}" aria-selected="${i === qIdx}">${lk(t.cat)}<span>${esc(t.name)}${t.shift ? ' ' + SM : ''}</span><span class="qd">${t.isEvent ? '◆ ' : ''}${esc(fmtYear(t.first))}</span></li>`).join('')
      : '<li aria-disabled="true">No match</li>';
    qlist.hidden = false;
    q.setAttribute('aria-expanded', 'true');
  }
  function pick(t) {
    if (!t) return;
    q.value = '';
    qlist.hidden = true;
    q.setAttribute('aria-expanded', 'false');
    if (!S.cats.has(t.cat)) { S.cats.add(t.cat); renderLegend(); }
    select(t, true);
  }
  q.addEventListener('input', renderFind);
  q.addEventListener('keydown', e => {
    if (qlist.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      qIdx = (qIdx + (e.key === 'ArrowDown' ? 1 : -1) + qItems.length) % Math.max(1, qItems.length);
      qlist.querySelectorAll('li').forEach((li, i) => li.setAttribute('aria-selected', String(i === qIdx)));
      q.setAttribute('aria-activedescendant', 'qo-' + qIdx);
    } else if (e.key === 'Enter') { e.preventDefault(); pick(qItems[qIdx]); }
    else if (e.key === 'Escape') { qlist.hidden = true; }
  });
  qlist.addEventListener('pointerdown', e => { const li = e.target.closest('[data-id]'); if (li) { e.preventDefault(); pick(BYID.get(li.dataset.id)); } });
  q.addEventListener('blur', () => setTimeout(() => { qlist.hidden = true; q.setAttribute('aria-expanded', 'false'); }, 120));

  /* ---------------- headline figures ---------------- */

  function renderTiles() {
    const ids = ['fire', 'farming', 'electricity', 'smartphone'];
    const short = { fire: 'Fire' };
    $('tiles').innerHTML = '<p class="tcap">Years from first use to half of humanity</p>' + ids.map(id => {
      const t = BYID.get(id);
      const d = fmtDur(t.cross[50] - t.origin).split(' ');
      return `<div class="tile"><div class="tl">${lk(t.cat)}${esc(short[id] || t.name)}</div><div class="tv">${esc(d[0])}</div></div>`;
    }).join('');
    $('lede').innerHTML = `The share of all people alive who used each of ${CURVES.length} technologies, plus ${EVENTS.length} key discoveries, from the first stone tools 3.3 million years ago to generative AI.<span class="more-lede"> Pick a period, zoom into any era, or click a line for its story.</span>`;
  }

  /* ---------------- speed chart ---------------- */

  const ssvg = $('ssvg'), sfig = $('sfig'), stip = $('stip');
  function speedData() {
    return CURVES.filter(t => catOn(t) && !t.measure).map(t => {
      const c = t.cross[S.thr];
      if (c != null) return { t, yrs: Math.max(0.5, c - t.origin), done: true };
      if (!t.declining && t.latest < S.thr && t.end >= NOW - 2) return { t, yrs: Math.max(0.5, NOW - t.origin), done: false };
      return null;
    }).filter(Boolean);
  }

  function drawSpeed() {
    const W = sfig.clientWidth, H = sfig.clientHeight;
    if (!W || !H) return;
    const narrow = W < 520;
    const L = narrow ? 64 : 92, R = W - 14, T = 12, B = H - 30;
    const sc = xscale([YMIN, NOW], L, R, 'log');
    const YMAXL = Math.log10(4e6);
    const yy = n => B - (Math.log10(Math.max(1, n)) / YMAXL) * (B - T);
    const data = speedData();
    const meas = document.createElement('canvas').getContext('2d');
    meas.font = FONT(12);
    const tks = xticks(sc, [YMIN, NOW], meas, W);
    const yt = [[1, '1 year'], [10, '10 years'], [100, '100 years'], [1e3, '1,000 years'], [1e4, '10,000 years'], [1e5, '100,000 years'], [1e6, '1M years']];
    let s = '';
    s += tks.map(t => `<line x1="${t.px.toFixed(1)}" x2="${t.px.toFixed(1)}" y1="${T}" y2="${B}" stroke="var(--grid)"/>`).join('');
    s += yt.map(([n]) => `<line x1="${L}" x2="${R}" y1="${yy(n).toFixed(1)}" y2="${yy(n).toFixed(1)}" stroke="var(--grid)"/>`).join('');
    s += `<line x1="${L}" x2="${R}" y1="${B + 0.5}" y2="${B + 0.5}" stroke="var(--axis)"/>`;
    s += yt.map(([n, l]) => `<text class="st-ax" x="${L - 8}" y="${yy(n).toFixed(1)}" text-anchor="end" dominant-baseline="middle">${narrow ? l.replace(' years', '').replace(' year', '') : l}</text>`).join('');
    s += tks.map(t => `<text class="st-ax" x="${t.px.toFixed(1)}" y="${B + 18}" text-anchor="middle">${esc(t.s)}</text>`).join('');
    // upper limit: it cannot take longer than the time since it appeared
    let lim = '';
    for (let px = L; px <= R; px += 3) {
      const y = sc.inv(px);
      const py = yy(Math.max(1, NOW - y));
      lim += (lim ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1);
    }
    s += `<path d="${lim}" fill="none" stroke="var(--axis)" stroke-width="1.5"/>`;
    const lx = sc.x(NOW - 30000), ly = yy(30000);
    const note = narrow ? 'limit' : 'limit: all the time since it appeared';
    meas.font = 'italic ' + FONT(12);
    const noteBox = { x0: lx + 6, x1: lx + 10 + meas.measureText(note).width, y0: ly - 20, y1: ly - 4 };
    s += `<text class="st-note" x="${(lx + 8).toFixed(1)}" y="${(ly - 12).toFixed(1)}">${note}</text>`;

    // dots: hollow = still spreading, plotted at time so far
    const dots = data.map(o => ({ ...o, x: sc.x(o.t.origin), y: yy(o.yrs) }));
    dots.sort((a, b) => (a.t === S.sel) - (b.t === S.sel));
    s += dots.map(o => {
      const c = `var(--c-${o.t.cat})`;
      const on = o.t === S.sel;
      const r = on ? 7 : 5;
      return `<g class="dot" data-id="${o.t.id}"><circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="13" fill="transparent"/>`
        + (o.done
          ? `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${r}" fill="${c}" stroke="var(--wash)" stroke-width="2"/>`
          : `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${r - 1}" fill="var(--wash)" stroke="${c}" stroke-width="2"/>`)
        + (on ? `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${r + 4}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>` : '')
        + '</g>';
    }).join('');

    // labels for milestones, greedy, never over each other
    const placed = [noteBox];
    const lab = dots.filter(o => o.t.key || o.t === S.sel).sort((a, b) => (b.t === S.sel) - (a.t === S.sel) || b.t.peak - a.t.peak);
    meas.font = FONT(12);
    for (const o of lab) {
      const w = meas.measureText(o.t.name).width;
      const opts = [[o.x + 9, o.y, 'start'], [o.x - 9, o.y, 'end'], [o.x - w / 2, o.y - 14, 'start'], [o.x - w / 2, o.y + 16, 'start'],
        [o.x - 8, o.y - 13, 'end'], [o.x - 8, o.y + 13, 'end'], [o.x + 8, o.y - 13, 'start'], [o.x + 8, o.y + 13, 'start']];
      for (const [tx, ty, an] of opts) {
        const x0 = an === 'end' ? tx - w : tx, x1 = x0 + w;
        if (x0 < L + 2 || x1 > R || ty < T + 6 || ty > B - 4) continue;
        const box = { x0: x0 - 2, x1: x1 + 2, y0: ty - 8, y1: ty + 8 };
        if (placed.some(p => !(box.x1 < p.x0 || box.x0 > p.x1 || box.y1 < p.y0 || box.y0 > p.y1))) continue;
        if (dots.some(d => d !== o && d.x > box.x0 - 2 && d.x < box.x1 + 2 && d.y > box.y0 - 2 && d.y < box.y1 + 2)) continue;
        placed.push(box);
        s += `<text class="st-lbl" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${an}" dominant-baseline="middle"${o.t === S.sel ? ' font-weight="600"' : ''}>${esc(o.t.name)}</text>`;
        break;
      }
    }
    ssvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ssvg.innerHTML = s;
    renderSpeedText(data);
  }

  function median(a) { if (!a.length) return null; const b = a.slice().sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }

  function renderSpeedText(data) {
    const thr = S.thr;
    const half = thr === 50 ? 'half of humanity' : thr + '% of humanity';
    $('scap').textContent = `Years from first appearance to ${half}, by when each technology appeared (both axes logarithmic)`;
    const fire = BYID.get('fire'), sp = BYID.get('smartphone');
    $('speedp').textContent = `Controlled fire took about ${fmtDur(fire.cross[thr] - fire.origin)} to reach ${half}; the smartphone took ${fmtDur(sp.cross[thr] - sp.origin)}. No dot can sit above the grey line, since nothing takes longer than the time since it appeared; hollow dots have not reached ${thr}% yet and sit at the time so far. Left out: technologies that peaked below ${thr}%, and lines measured differently, by country (nuclear power, GM crops) or by share of energy (coal, oil).`;
    const eras = [
      ['Before 10,000 BCE', -Infinity, -10000],
      ['10,000 BCE to 1 CE', -10000, 1],
      ['1 CE to 1800', 1, 1800],
      ['1800 to 1950', 1800, 1950],
      ['After 1950', 1950, Infinity]
    ];
    const done = data.filter(o => o.done);
    $('eras').innerHTML = `<div class="eh">Median time to ${thr}%, by when it appeared</div>` + eras.map(([label, a, b]) => {
      const g = done.filter(o => o.t.origin >= a && o.t.origin < b);
      const m = median(g.map(o => o.yrs));
      return `<div class="er"><div class="el">${label}</div><div class="ev">${m == null ? '–' : esc(fmtDur(m))}</div><div class="en">${g.length} technolog${g.length === 1 ? 'y' : 'ies'}</div></div>`;
    }).join('');
  }

  $('thr').addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; S.thr = +b.dataset.v; setPressed($('thr'), S.thr); drawSpeed(); });
  ssvg.addEventListener('pointermove', e => {
    const g = e.target.closest('[data-id]');
    if (!g) { stip.hidden = true; return; }
    const t = BYID.get(g.dataset.id);
    const c = t.cross[S.thr];
    stip.innerHTML = c != null
      ? `<div class="tv">${esc(fmtDur(Math.max(0.5, c - t.origin)))}</div><div class="tn">${lk(t.cat)}${esc(t.name)}</div><div class="ty">from ${esc(fmtYear(t.origin, true))} to ${S.thr}% by ${esc(fmtYear(c, true))}</div>`
      : `<div class="tv">Not yet at ${S.thr}%</div><div class="tn">${lk(t.cat)}${esc(t.name)}</div><div class="ty">${fmtPct(t.latest)} in ${esc(fmtYear(t.end))}, ${esc(fmtDur(NOW - t.origin))} since it appeared</div>`;
    stip.hidden = false;
    const fr = sfig.getBoundingClientRect();
    let x = e.clientX - fr.left + 14, y = e.clientY - fr.top + 14;
    if (x + stip.offsetWidth > fr.width) x = e.clientX - fr.left - stip.offsetWidth - 14;
    if (y + stip.offsetHeight > fr.height) y = e.clientY - fr.top - stip.offsetHeight - 14;
    stip.style.transform = `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
  });
  ssvg.addEventListener('pointerleave', () => { stip.hidden = true; });
  ssvg.addEventListener('click', e => {
    const g = e.target.closest('[data-id]');
    if (!g) return;
    select(BYID.get(g.dataset.id), true);
    $('chart').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------------- table ---------------- */

  const tbody = $('tbl').querySelector('tbody');
  function renderTable() {
    const s = S.tq.trim().toLowerCase();
    const { k, dir } = S.tsort;
    const key = {
      name: t => t.name.toLowerCase(), cat: t => CATI[t.cat] * 1e8 + t.origin, origin: t => t.first,
      t10: t => t.cross[10] == null ? Infinity : t.cross[10] - t.origin,
      t50: t => t.cross[50] == null ? Infinity : t.cross[50] - t.origin,
      latest: t => t.latest == null ? -1 : t.latest, q: t => t.isEvent ? 4 : t.q
    }[k];
    const rows = TECHS.filter(t => catOn(t) && (!s || t.search.includes(s)))
      .sort((a, b) => { const x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : a.first - b.first) * (x === y ? 1 : dir); });
    const reach = (t, T) => t.cross[T] != null
      ? `${esc(fmtYear(t.cross[T], true))}<span class="sub">after ${esc(sinceOrigin(t, t.cross[T]))}</span>`
      : `<span class="sub">${neverReached(t) ? 'never' : 'not yet'}</span>`;
    const none = '<span class="sub">no usage line</span>';
    tbody.innerHTML = rows.map(t => `<tr${t === S.sel ? ' class="on"' : ''}>`
      + `<td data-l="Technology"><button type="button" class="tn" data-id="${t.id}">${esc(t.name)}</button>${t.shift ? ` <span class="sm" title="Mental shift">${SM}</span>` : ''}</td>`
      + `<td data-l="Category"><span class="tc">${lk(t.cat)}${esc(CATS[CATI[t.cat]].name)}</span></td>`
      + `<td data-l="First evidence">${esc(fmtYear(t.first))}</td>`
      + `<td data-l="Where">${esc(t.where)}${t.by ? `<span class="sub">by ${esc(t.by)}</span>` : ''}</td>`
      + `<td data-l="Reached 10%" class="num">${t.isEvent ? none : reach(t, 10)}</td>`
      + `<td data-l="Reached 50%" class="num">${t.isEvent ? none : reach(t, 50)}</td>`
      + `<td data-l="Latest share" class="num">${t.isEvent ? '' : fmtPct(t.latest)}${t.declining ? `<span class="sub">peak ${fmtPct(t.peak)}</span>` : ''}</td>`
      + `<td data-l="Data">${t.isEvent ? 'Discovery' : QLABEL[t.q]}${t.measure ? `<span class="sub">${t.measure === 'country' ? 'counted by country' : 'share of world energy'}</span>` : ''}</td></tr>`).join('');
    $('tableh').textContent = rows.length === TECHS.length ? `All ${CURVES.length} technologies and ${EVENTS.length} discoveries` : `${rows.length} of ${TECHS.length} entries`;
    $('tbl').querySelectorAll('th button').forEach(b => {
      if (b.dataset.k === k) b.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); else b.removeAttribute('aria-sort');
    });
  }
  $('tbl').querySelector('thead').addEventListener('click', e => {
    const b = e.target.closest('button[data-k]');
    if (!b) return;
    const k = b.dataset.k;
    S.tsort = { k, dir: S.tsort.k === k ? -S.tsort.dir : (k === 'latest' ? -1 : 1) };
    renderTable();
  });
  tbody.addEventListener('click', e => {
    const b = e.target.closest('[data-id]');
    if (!b) return;
    select(BYID.get(b.dataset.id), true);
    $('chart').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  $('tq').addEventListener('input', e => { S.tq = e.target.value; renderTable(); });

  $('conf').innerHTML = [1, 2, 3].map(n => `<dt>${QLABEL[n]} <span class="n">${CURVES.filter(t => t.q === n).length} lines</span></dt><dd>${QTEXT[n]}</dd>`).join('')
    + `<dt>◆ Discoveries <span class="n">${EVENTS.length}</span></dt><dd>Ideas and firsts with a date but no usage line, such as DNA or cognitive biases.</dd>`
    + `<dt>${SM} Mental shifts <span class="n">${TECHS.filter(t => t.shift).length}</span></dt><dd>Technologies that changed how people think or live, each with a line on what shifted.</dd>`;

  /* ---------------- the collective brain: family trees and losses ---------------- */

  const tfig = $('tfig'), tsvg = $('tsvg'), ttip = $('ttip'), troot = $('troot');
  let treeRoot = BYID.get('smartphone');
  let treeHover = null;

  function setTreeRoot(t) {
    if (!t) return;
    treeRoot = t;
    troot.value = t.id;
    treeHover = null;
    drawTree();
  }

  // every ancestor of an invention, laid out in time from left to right
  function drawTree() {
    const t = treeRoot;
    if (!t || !tfig.clientWidth) return;
    const anc = [...ancestors(t)];
    const nodes = [...anc, t].sort((a, b) => a.first - b.first);
    const meas = document.createElement('canvas').getContext('2d');
    meas.font = FONT(12, 500);
    const W = Math.max(tfig.parentElement.clientWidth, 680);
    const labelW = n => meas.measureText(n.name).width + 18;
    const L = 16, R = W - 16 - Math.min(170, labelW(t)), T = 14, ROW = 24;
    const minY = Math.min(...nodes.map(n => n.first));
    const sc = xscale([Math.max(YMIN, minY - (NOW - minY) * 0.12), NOW], L, R, 'log');
    // pack nodes into lanes so labels never overlap
    const lanes = [];
    const pos = new Map();
    for (const n of nodes) {
      const x = sc.x(n.first), w = labelW(n);
      let i = lanes.findIndex(end => end < x - 4);
      if (i < 0) { lanes.push(0); i = lanes.length - 1; }
      lanes[i] = x + w;
      pos.set(n, { x, y: T + 8 + i * ROW });
    }
    const H = T + 8 + lanes.length * ROW + 34;
    tfig.style.height = H + 'px';
    tsvg.style.minWidth = W + 'px';
    tsvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    tsvg.setAttribute('width', W);
    tsvg.setAttribute('height', H);
    const B = H - 30;
    let s = '';
    AGES.forEach((a, i) => {
      if (i % 2 !== 1) return;
      const x0 = Math.max(L, sc.x(Math.max(a.from, sc.inv(L)))), x1 = Math.min(R, sc.x(a.to));
      if (x1 > x0) s += `<rect x="${x0.toFixed(1)}" y="0" width="${(x1 - x0).toFixed(1)}" height="${B}" fill="var(--wash)"/>`;
    });
    meas.font = FONT(12);
    const tks = xticks(sc, [sc.inv(L), NOW], meas, W);
    s += tks.map(k => `<line x1="${k.px.toFixed(1)}" x2="${k.px.toFixed(1)}" y1="0" y2="${B}" stroke="var(--grid)"/><text class="st-ax" x="${k.px.toFixed(1)}" y="${B + 18}" text-anchor="middle">${esc(k.s)}</text>`).join('');
    HUMAN.forEach(h => {
      if (h.year < sc.inv(L)) return;
      const x = sc.x(h.year).toFixed(1);
      s += `<line x1="${x}" x2="${x}" y1="0" y2="${B}" stroke="var(--ink)" stroke-opacity=".35"/>`;
    });
    const hov = treeHover;
    const hotEdge = (a, b) => hov && (hov === a || hov === b);
    for (const n of nodes) for (const p of n.onT) {
      if (!pos.has(p)) continue;
      const a = pos.get(p), b = pos.get(n), mx = (a.x + b.x) / 2;
      s += `<path d="M${a.x.toFixed(1)} ${a.y} C${mx.toFixed(1)} ${a.y} ${mx.toFixed(1)} ${b.y} ${b.x.toFixed(1)} ${b.y}" fill="none" stroke="${hotEdge(p, n) ? 'var(--ink)' : 'var(--axis)'}" stroke-width="${hotEdge(p, n) ? 1.75 : 1.1}" stroke-opacity="${hov && !hotEdge(p, n) ? 0.45 : 1}"/>`;
    }
    for (const n of nodes) {
      const { x, y } = pos.get(n);
      const c = `var(--c-${n.cat})`;
      const mark = n.isEvent
        ? `<path d="M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y} Z" fill="${c}" stroke="var(--bg)" stroke-width="2"/>`
        : `<circle cx="${x.toFixed(1)}" cy="${y}" r="${n === t ? 7 : 5}" fill="${c}" stroke="var(--bg)" stroke-width="2"/>`;
      s += `<g class="tnode" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(n.name)}, ${esc(fmtYear(n.first))}"><rect x="${(x - 8).toFixed(1)}" y="${y - 11}" width="${(labelW(n) + 8).toFixed(1)}" height="22" fill="transparent"/>${mark}`
        + `<text class="tr-lbl" x="${(x + 10).toFixed(1)}" y="${y}" dominant-baseline="middle"${n === t || n === hov ? ' font-weight="700"' : ''}>${esc(n.name)}</text></g>`;
    }
    tsvg.innerHTML = s;
    const longest = depth(t);
    const first = nodes[0];
    $('tcap').textContent = `Family tree: ${t.name}`;
    $('tstat').textContent = anc.length
      ? `${t.name} builds on ${anc.length} earlier inventions and discoveries in this timeline, in chains up to ${longest} steps long, reaching back to ${first.name.toLowerCase()} ${fmtYear(first.first)}.`
      : `${t.name} has no earlier inventions listed here as prerequisites.`;
  }

  tsvg.addEventListener('pointermove', e => {
    const g = e.target.closest('.tnode');
    const n = g ? BYID.get(g.dataset.id) : null;
    if (n !== treeHover) { treeHover = n; drawTree(); }
    if (!n) { ttip.hidden = true; return; }
    ttip.innerHTML = `<div class="tv">${esc(fmtYear(n.first))}</div><div class="tn">${lk(n.cat)}${esc(n.name)}</div>`
      + `<div class="ty">${n.onT.length ? 'Built on ' + n.onT.map(p => esc(p.name)).join(', ') : 'No prerequisites listed'}. Click to see its own tree.</div>`;
    ttip.hidden = false;
    const fr = tfig.getBoundingClientRect();
    let x = e.clientX - fr.left + 14, y = e.clientY - fr.top + 14;
    if (x + ttip.offsetWidth > fr.width) x = e.clientX - fr.left - ttip.offsetWidth - 14;
    if (y + ttip.offsetHeight > fr.height) y = e.clientY - fr.top - ttip.offsetHeight - 14;
    ttip.style.transform = `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
  });
  tsvg.addEventListener('pointerleave', () => { ttip.hidden = true; if (treeHover) { treeHover = null; drawTree(); } });
  tsvg.addEventListener('click', e => { const g = e.target.closest('.tnode'); if (g) setTreeRoot(BYID.get(g.dataset.id)); });
  tsvg.addEventListener('keydown', e => { if (e.key === 'Enter') { const g = e.target.closest('.tnode'); if (g) setTreeRoot(BYID.get(g.dataset.id)); } });
  troot.addEventListener('change', e => setTreeRoot(BYID.get(e.target.value)));
  $('tshow').addEventListener('click', () => { select(treeRoot, true); $('chart').scrollIntoView({ behavior: smooth(), block: 'start' }); });

  function renderLosses() {
    $('losses').innerHTML = LOSSES.slice().sort((a, b) => a.year - b.year).map(l => `<li class="loss">`
      + `<div class="ly">${esc(fmtYear(l.year))}</div>`
      + `<div class="lb"><h4>${LM} ${esc(l.name)} <span class="lw">${esc(l.where)}</span></h4><p>${esc(l.desc)}</p>`
      + `<div class="kin"><span class="kl">Lost</span>${l.techsT.map(chip).join('')}</div>`
      + `<p class="lm"><span>${esc(l.cause)}</span><span>${l.regained == null ? 'Not regained' : `Regained ${esc(fmtYear(l.regained, true))}`}</span>`
      + `<button type="button" class="more" data-loss="${l.id}">Show on the timeline</button></p></div></li>`).join('');
  }
  $('losses').addEventListener('click', e => {
    const c = e.target.closest('[data-id]');
    const l = e.target.closest('[data-loss]');
    if (!c && !l) return;
    select(c ? BYID.get(c.dataset.id) : LOSSBYID.get(l.dataset.loss), true);
    $('chart').scrollIntoView({ behavior: smooth(), block: 'start' });
  });

  function renderPop() {
    const f = n => n >= 1000 ? `${trim(n / 1000, 2)} billion` : `${trim(n, n < 10 ? 1 : 0)} million`;
    $('pop').innerHTML = POP.map(([y, n]) => `<div class="pp"><div class="py">${esc(fmtYear(y))}</div><div class="pv">${f(n)}</div></div>`).join('');
  }

  function initBrain() {
    const opts = TECHS.filter(t => t.onT.length).sort((a, b) => a.name.localeCompare(b.name));
    troot.innerHTML = opts.map(t => `<option value="${t.id}">${esc(t.name)}</option>`).join('');
    troot.value = treeRoot.id;
    renderLosses();
    renderPop();
    drawTree();
  }

  /* ---------------- boot ---------------- */

  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const t = BYID.get(id);
    if (t && t !== S.sel) select(t, true);
  }
  window.addEventListener('hashchange', fromHash);

  function redrawAll() { readColors(); draw(); drawSpeed(); drawTree(); }
  const ro = new ResizeObserver(() => { draw(); drawSpeed(); drawTree(); });
  ro.observe(fig);
  ro.observe(sfig);
  ro.observe(tfig);
  const themeObs = new MutationObserver(redrawAll);
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { draw(); drawSpeed(); });

  if (matchMedia('(min-width: 900px)').matches) $('tdet').open = true;
  readColors();
  renderTiles();
  renderLegend();
  setPressed(scopeEl, S.scope);
  applyView();
  renderTable();
  renderDetails();
  drawSpeed();
  initBrain();
  fromHash();
}
