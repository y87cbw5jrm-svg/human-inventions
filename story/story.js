/* Human Inventions: the story. A picture-book encyclopedia that turns the dataset into pages in time order.
   Pages: cover, contents, nine chapter openers, one page per invention, discovery, human milestone and
   lost-know-how episode, and an ending. Pictures come from art.js; text comes from text/<level>-*.js.

   Three reading levels share every page:
     little  ages 4 to 7, read aloud          story/little/
     kids    ages 8 to 12                     the site's home page (story/ redirects there)
     adults  deeper text with sources         story/adults/
   Each level's index.html sets window.LEVEL and window.STORY_ROOT (the path to story/); the home page also
   sets window.STORY_HOME (the path to the site root, otherwise STORY_ROOT + '../'). The chart is at chart/. */
(function () {
  'use strict';
  var D = window.INVENTIONS, ART = window.ART || { get: function () { return null; } };
  // adult pages can show a photograph of a real object instead of the drawing (photos/photos.js)
  var PHOTOS = window.PHOTOS || {};
  var NOW = D.now;
  var LEVEL = window.LEVEL || 'kids', ROOT = window.STORY_ROOT || '';
  var HOME = window.STORY_HOME != null ? window.STORY_HOME : ROOT + '../';
  var CHART = HOME + 'chart/';
  // the ages 8 to 12 book is the home page; the other levels live under story/
  function levelHref(k) { return k === 'kids' ? (HOME || './') : HOME + 'story/' + LEVELS[k].path; }

  var LEVELS = {
    little: {
      label: '4–7', name: 'Ages 4 to 7', path: 'little/', key: 'human-inventions-story-little',
      sub: 'A read-aloud picture book about how people learned to make fire, grow food, build homes and talk to the whole world.',
      note: 'For children aged 4 to 7 and the grown-ups who read to them. Every page has a picture, a few sentences to read aloud, and a question to talk about together.',
      contents: 'Nine chapters, from long, long ago to today.',
      end: 'What will you make?', wow: 'Wow!', big: 'Big idea', ask: 'Let’s talk', lostBadge: 'Forgotten!',
      lostTag: 'Sometimes people forget', why: 'Why?', start: 'Start the story →'
    },
    kids: {
      label: '8–12', name: 'Ages 8 to 12', path: '', key: 'human-inventions-story',
      sub: 'The story of how people learned to make fire, grow food, build cities and talk to the whole world, one invention at a time.',
      note: 'For curious readers aged 8 to 12, and the grown-ups who read with them.',
      contents: 'Nine chapters, from the first stone tools to today. Every page is one invention, in the order people made them.',
      end: 'What will you invent?', wow: 'Wow!', big: '✦ Big idea', ask: 'Think about it', lostBadge: 'Lost!',
      lostTag: 'Progress can go backwards too', why: 'Why it was lost', start: 'Start reading →'
    },
    adults: {
      label: 'Adults', name: 'For adults', path: 'adults/', key: 'human-inventions-story-adults',
      sub: 'A history of human invention from the first stone tools to AI, one invention at a time: the evidence, how each spread, what it was built on, what is still debated, and what was lost.',
      note: 'Written for adults, with sources on every page. It follows Joseph Henrich’s view of cumulative culture: inventions are recombinations of know-how held by whole populations, and that know-how can be lost.',
      contents: 'Nine chapters, from 3.3 million years ago to today, each invention on its own page in order of its earliest evidence.',
      end: 'What comes next', wow: 'Worth knowing', big: '✦ Mental shift', ask: 'To think about', lostBadge: 'Lost',
      lostTag: 'Progress can be lost', why: 'Why it was lost', start: 'Start reading →'
    }
  };
  var L = LEVELS[LEVEL] || LEVELS.kids;
  document.body.classList.add('lv-' + LEVEL);

  /* ---------- story text: blocks written as
       @id
       paragraph text…            (blank line = new paragraph)
       ! Wow fact                 * Big idea (a mental shift)      = Today line
       > Who made it              # Title override                 ? A question to talk about
       ^ A source (one per line, several allowed)
     ---------- */
  var TEXT = {};
  String(window.STORY_TEXT || '').split(/^@/m).forEach(function (block) {
    block = block.replace(/\r/g, '');
    var nl = block.indexOf('\n');
    if (nl < 0) return;
    var id = block.slice(0, nl).trim();
    if (!id) return;
    var e = { paras: [], wow: '', big: '', today: '', by: '', title: '', ask: '', sources: [] }, cur = [];
    block.slice(nl + 1).split('\n').forEach(function (line) {
      var s = line.trim(), m = /^([!*=>#?^])\s+(.*)$/.exec(s);
      if (m) {
        if (cur.length) { e.paras.push(cur.join(' ')); cur = []; }
        var k = { '!': 'wow', '*': 'big', '=': 'today', '>': 'by', '#': 'title', '?': 'ask', '^': 'sources' }[m[1]];
        if (k === 'sources') e.sources.push(m[2]); else e[k] = m[2];
      } else if (!s) {
        if (cur.length) { e.paras.push(cur.join(' ')); cur = []; }
      } else cur.push(s);
    });
    if (cur.length) e.paras.push(cur.join(' '));
    TEXT[id] = e;
  });

  /* ---------- chapters ---------- */
  function A(n) { return NOW - n; }
  var CHAPTERS = [
    { n: 1, color: 'energy', title: 'Before people like us', short: 'First humans', from: -Infinity, to: A(300000) },
    { n: 2, color: 'ideas', title: 'Ice Age inventors', short: 'Ice Age', from: A(300000), to: -10500 },
    { n: 3, color: 'food', title: 'The first farmers', short: 'Farmers', from: -10500, to: -4000 },
    { n: 4, color: 'shelter', title: 'Cities, writing and metal', short: 'Cities', from: -4000, to: 1000 },
    { n: 5, color: 'move', title: 'Water and wind', short: 'Water & wind', from: 1000, to: 1733 },
    { n: 6, color: 'tools', title: 'The Industrial Revolution', short: 'Industry', from: 1733, to: 1879 },
    { n: 7, color: 'electric', title: 'The Electric Age', short: 'Electric', from: 1879, to: 1947 },
    { n: 8, color: 'body', title: 'The Electronic Age', short: 'Electronic', from: 1947, to: 1973 },
    { n: 9, color: 'tools', title: 'The Information Age', short: 'Information', from: 1973, to: Infinity }
  ];
  // a chapter opener's "# title" line renames the chapter for that reading level
  CHAPTERS.forEach(function (c) { var t = TEXT['chapter-' + c.n]; if (t && t.title) { c.title = t.title; c.short = t.title; } });
  function chapterOf(year) {
    for (var i = 0; i < CHAPTERS.length; i++) if (year >= CHAPTERS[i].from && year < CHAPTERS[i].to) return CHAPTERS[i];
    return CHAPTERS[CHAPTERS.length - 1];
  }

  /* ---------- the pages ---------- */
  var CAT = {}; D.cats.forEach(function (c) { CAT[c.id] = c; });
  var entries = [];
  D.techs.forEach(function (t, i) {
    entries.push({ id: t.id, type: t.kind === 'event' ? 'event' : 'tech', year: t.first, tech: t, cat: t.cat, order: i });
  });
  D.human.forEach(function (h, i) {
    entries.push({ id: i === 0 ? 'homo' : 'sapiens', type: 'human', year: h.year, human: h, cat: null, order: -10 + i });
  });
  D.losses.forEach(function (l, i) {
    entries.push({ id: 'lost-' + l.id, type: 'loss', year: l.year, loss: l, cat: null, order: 1000 + i });
  });
  // a lost-know-how page comes after anything else in the same year
  entries.sort(function (a, b) { return a.year - b.year || (a.type === 'loss') - (b.type === 'loss') || a.order - b.order; });

  var PAGES = [{ id: 'start', type: 'cover' }, { id: 'contents', type: 'contents' }];
  CHAPTERS.forEach(function (c) {
    c.items = entries.filter(function (e) { return chapterOf(e.year) === c; });
    PAGES.push({ id: 'chapter-' + c.n, type: 'chapter', chapter: c });
    c.items.forEach(function (e) { e.chapter = c; PAGES.push(e); });
  });
  PAGES.push({ id: 'the-end', type: 'end' });
  var BYID = {}; PAGES.forEach(function (p, i) { p.index = i; BYID[p.id] = p; });
  var FIRST_IN = {}; CHAPTERS.forEach(function (c) { FIRST_IN[c.n] = BYID['chapter-' + c.n].index; });

  /* ---------- words ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function n(v) { return Math.round(v).toLocaleString('en-US'); }
  function ago(bp) {
    if (bp >= 1e6) return (Math.round(bp / 1e5) / 10) + ' million years ago';
    if (bp >= 100000) return n(Math.round(bp / 1000) * 1000) + ' years ago';
    if (bp >= 1000) return n(Math.round(bp / 100) * 100) + ' years ago';
    if (bp >= 200) return n(Math.round(bp / 10) * 10) + ' years ago';
    if (bp < 1) return 'this year';
    if (bp < 2) return 'last year';
    return Math.floor(bp) + ' years ago';
  }
  // dates written as "years ago" in the data (non-whole years) are rough, so they are rounded to the century
  function approx(y) { return NOW - y >= 12000 || (y < 1500 && (Math.round(y) % 100 === 0 || y % 1 !== 0)); }
  // "about 9500 BCE" for the main label; deep time is told in years ago
  function when(y) {
    var bp = NOW - y;
    if (bp >= 12000) return ago(bp);
    var v = y < 1500 && y % 1 !== 0 ? Math.round(y / 100) * 100 : y;
    var yr = v < 0 ? Math.round(-v) + ' BCE' : String(Math.floor(v));
    return (approx(y) ? 'about ' : '') + yr;
  }
  function whenLong(y) {
    var bp = NOW - y;
    if (bp >= 12000) return 'About ' + ago(bp);
    var a = Math.floor(NOW) - Math.floor(y);
    if (LEVEL === 'little') return (y < 1500 ? 'About ' : '') + cap(ago(y < 0 ? bp : a));
    return cap(when(y)) + ' · ' + (approx(y) || y < 0 ? 'about ' : '') + ago(y < 0 ? bp : a);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function span(c) {
    var a = c.from === -Infinity ? NOW - 3300000 : c.from, b = c.to === Infinity ? NOW : c.to;
    if (LEVEL === 'little') {
      if (c.n === 9) return 'From about 50 years ago to today';
      return 'From ' + ago(NOW - a).replace(' years ago', '').replace(/^/, 'about ') + ' to ' + ago(NOW - b).replace(/^/, 'about ');
    }
    if (c.n === 9) return 'From 1973 to today';
    if (a >= 0) return 'From ' + (a === 1000 ? 'the year 1000' : when(a)) + ' to ' + when(b);
    if (NOW - b >= 12000) return 'From ' + ago(NOW - a).replace(' years ago', '') + ' to ' + ago(NOW - b);
    if (NOW - a >= 12000) return 'From ' + ago(NOW - a).replace(' years ago', '') + ' years ago to ' + when(b).replace('about ', '');
    return 'From ' + when(a).replace('about ', '') + ' to ' + (b > 0 ? 'the year ' + b : when(b).replace('about ', ''));
  }
  function nameOf(p) {
    if (!p) return '';
    var t = TEXT[p.id];
    if (t && t.title && p.type !== 'chapter') return t.title;
    if (p.type === 'cover') return 'Cover';
    if (p.type === 'contents') return 'Contents';
    if (p.type === 'chapter') return 'Chapter ' + p.chapter.n + ': ' + p.chapter.title;
    if (p.type === 'end') return L.end;
    if (p.type === 'human') return p.id === 'homo' ? 'The first humans' : 'People like us';
    if (p.type === 'loss') return /lost/i.test(p.loss.name) ? p.loss.name : 'Lost: ' + p.loss.name;
    return p.tech.name;
  }
  function shortName(p) {
    if (p.type === 'chapter') return 'Chapter ' + p.chapter.n;
    return nameOf(p);
  }
  function colorOf(cat) { return cat ? 'var(--c-' + cat + ')' : 'var(--ink)'; }

  // default "today" line from the usage curve, used only when the story does not give one
  function todayLine(t) {
    if (!t.pts || t.measure || LEVEL === 'little') return '';
    var p = t.pts[t.pts.length - 1][1], peak = Math.max.apply(null, t.pts.map(function (q) { return q[1]; }));
    if (p >= 97) return 'Today almost everyone on Earth uses it.';
    if (p < 1.5 && peak > 10) return 'Today hardly anyone uses it any more: newer inventions took its place.';
    var still = peak > p * 1.6 ? ' still' : '';
    if (p >= 15) return 'Today about ' + Math.round(p / 10) + ' in 10 people' + still + ' use it.';
    return 'Today about ' + Math.max(1, Math.round(p)) + ' in 100 people' + still + ' use it.';
  }
  // what the chart's line for this invention measures (adults)
  function chartNote(x) {
    if (x.kind === 'event') return 'A discovery: shown as a diamond on the chart, with no usage line.';
    var m = /Line: (.*?)(?:\.(?=\s|$))/.exec(x.desc);
    var what = m ? m[1] : 'the share of all people alive who used it';
    if (x.measure === 'energy') what = 'share of world energy';
    return 'On the chart, its line shows ' + what.charAt(0).toLowerCase() + what.slice(1) + '.';
  }

  /* ---------- pictures ---------- */
  function art(id, fallback) {
    var inner = ART.get(id) || (fallback && ART.get(fallback));
    if (!inner) inner = '<circle class="f fb" cx="60" cy="60" r="34"/><text x="60" y="68" text-anchor="middle" font-size="24" class="tx">?</text>';
    return '<svg class="art" viewBox="0 0 120 120" aria-hidden="true">' + inner + '</svg>';
  }

  // the picture panel: a credited photograph on adult pages where one exists, otherwise the drawing
  function plate(id, pill, fallback) {
    var ph = LEVEL === 'adults' && PHOTOS[id];
    var when = pill ? '<div class="when"><span class="pill">' + esc(pill) + '</span></div>' : '';
    if (!ph) return '<div class="plate">' + art(id, fallback) + when + '</div>';
    return '<figure class="photo"><div class="frame"><img src="' + ROOT + 'photos/' + ph.file + '" width="' + ph.w + '" height="' + ph.h + '" alt="' + esc(ph.alt || ph.caption) + '" decoding="async"></div>' +
      '<figcaption>' + esc(ph.caption) + '<span class="credit">' + esc(ph.credit) + ' · <a href="' + ph.licenseUrl + '" rel="license">' + esc(ph.license) + '</a> · <a href="' + ph.source + '">source</a></span></figcaption></figure>';
  }

  /* ---------- rendering ---------- */
  var book = document.getElementById('book'), pager = document.getElementById('pager');
  var ribbon = document.getElementById('ribbon'), whereEl = document.getElementById('where');

  // reading-level switch in the header
  var levelsNav = document.createElement('nav');
  levelsNav.className = 'levels'; levelsNav.setAttribute('aria-label', 'Reading level');
  var bar = document.querySelector('.bar');
  if (bar) bar.insertBefore(levelsNav, bar.querySelector('.tocbtn'));
  function renderLevels(p) {
    levelsNav.innerHTML = ['little', 'kids', 'adults'].map(function (k) {
      var v = LEVELS[k];
      return '<a href="' + levelHref(k) + '#' + p.id + '" title="' + v.name + '"' + (k === LEVEL ? ' class="on" aria-current="true"' : '') + '>' + v.label + '</a>';
    }).join('');
  }

  function link(p, cls) {
    var c = p.cat ? ' style="--c:' + colorOf(p.cat) + '"' : '';
    return '<a class="' + (cls === undefined ? 'chip' : cls) + (p.type === 'loss' ? ' lost' : '') + '" href="#' + p.id + '"' + c + '><i></i>' + esc(shortName(p)) + '</a>';
  }
  function paras(t, fallback) {
    var ps = t && t.paras && t.paras.length ? t.paras : (fallback ? [fallback] : []);
    return ps.map(function (s) { return '<p>' + esc(s) + '</p>'; }).join('');
  }
  function listOf(items) {
    return '<ul class="inlist">' + items.map(function (e) { return '<li>' + link(e, '') + '</li>'; }).join('') + '</ul>';
  }
  function boxes(t, cls) {
    return (t.wow ? '<div class="box wow"' + (cls ? ' style="--c:var(--muted)"' : '') + '><h2>' + L.wow + '</h2>' + esc(t.wow) + '</div>' : '') +
      (t.ask ? '<div class="box ask"><h2>' + L.ask + '</h2>' + esc(t.ask) + '</div>' : '');
  }
  function sources(t) {
    if (!t.sources || !t.sources.length) return '';
    return '<div class="sources"><h2>Sources</h2><ul>' + t.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
  }

  function renderCover() {
    var saved = load();
    var cont = saved && BYID[saved] && BYID[saved].index > 1 ? BYID[saved] : null;
    return '<section class="cover">' +
      '<svg class="logo" viewBox="0 0 1000 859" aria-hidden="true"><use href="#brand-mark"/></svg>' +
      '<div><p class="chapno">' + L.name + '</p><h1 tabindex="-1">Human Inventions</h1>' +
      '<p class="sub">' + L.sub + '</p>' +
      '<div class="btns">' +
      (cont ? '<a class="btn main" href="#' + cont.id + '">Keep reading: ' + esc(shortName(cont)) + ' →</a><a class="btn" href="#chapter-1">Start from the beginning</a>'
            : '<a class="btn main" href="#chapter-1">' + L.start + '</a>') +
      '<a class="btn" href="#contents">Contents</a></div>' +
      '<p class="note">' + L.note + ' ' + D.techs.length + ' inventions and discoveries, and ' + D.losses.length + ' times people forgot what they knew, in ' + CHAPTERS.length + ' chapters. ' +
      'Turn the pages with the buttons, the arrow keys or a swipe.</p>' +
      '<p class="note">Also for ' + ['little', 'kids', 'adults'].filter(function (k) { return k !== LEVEL; }).map(function (k) {
        return '<a href="' + levelHref(k) + '">' + LEVELS[k].name.replace(/^For /, '').replace(/^Ages/, 'ages') + '</a>';
      }).join(' and ') + ', and as an <a href="' + CHART + '">interactive chart</a>.</p>' +
      '</div></section>';
  }

  function renderContents() {
    return '<section class="toc"><h1 tabindex="-1">Contents</h1>' +
      '<p class="years">' + L.contents + '</p>' +
      '<div class="grid">' + CHAPTERS.map(function (c) {
        return '<div class="card"><p class="chapno">Chapter ' + c.n + '</p><h2><a href="#chapter-' + c.n + '">' + esc(c.title) + '</a></h2>' +
          '<p class="years">' + esc(span(c)) + '</p>' + listOf(c.items) + '</div>';
      }).join('') + '</div></section>';
  }

  function renderChapter(c) {
    var t = TEXT['chapter-' + c.n] || {};
    return '<section class="spread chap">' +
      '<div class="plate" style="--c:var(--c-' + c.color + ')">' + art('chapter-' + c.n) + '</div>' +
      '<div><p class="chapno">Chapter ' + c.n + '</p><h1 tabindex="-1">' + esc(c.title) + '</h1>' +
      '<p class="years">' + esc(span(c)) + '</p>' +
      '<div class="story">' + paras(t) + '</div>' + boxes(t) + sources(t) +
      '<div class="box big"><h2>In this chapter</h2>' + listOf(c.items) + '</div>' +
      '<div class="btns"><a class="btn main" href="#' + c.items[0].id + '">Start the chapter →</a></div>' +
      '</div></section>';
  }

  function renderTech(p) {
    var x = p.tech, t = TEXT[p.id] || {}, cat = CAT[x.cat];
    var led = D.techs.filter(function (y) { return y.on.indexOf(x.id) >= 0; }).map(function (y) { return BYID[y.id]; });
    var built = x.on.map(function (id) { return BYID[id]; }).filter(Boolean);
    var lost = D.losses.filter(function (l) { return l.techs.indexOf(x.id) >= 0; }).map(function (l) { return BYID['lost-' + l.id]; });
    var today = t.today || todayLine(x);
    var big = t.big || (LEVEL === 'little' ? '' : x.shift);
    var badges = '<span class="badge">' + (p.type === 'event' ? 'Discovery' : 'Invention') + '</span>' +
      (x.shift ? '<span class="badge" style="background:color-mix(in srgb,' + colorOf(x.cat) + ' 22%,var(--paper))">' + (LEVEL === 'adults' ? '✦ Mental shift' : '✦ Big idea') + '</span>' : '');
    return '<article class="spread" style="--c:' + colorOf(x.cat) + '">' +
      plate(x.id, whenLong(x.first)) +
      '<div><p class="label"><i class="dot"></i>' + esc(cat.name) + badges + '</p>' +
      '<h1 tabindex="-1">' + esc(nameOf(p)) + '</h1>' +
      '<p class="facts"><span><b>When:</b> ' + esc(when(x.first)) + '</span><span><b>Where:</b> ' + esc(x.where) + '</span>' +
      (t.by || x.by ? '<span><b>First made by:</b> ' + esc(t.by || x.by) + '</span>' : '') + '</p>' +
      '<div class="story">' + paras(t, x.desc) + '</div>' +
      boxes(t) +
      (big ? '<div class="box big"><h2>' + L.big + '</h2>' + esc(big) + '</div>' : '') +
      (today ? '<p class="today">' + esc(today) + '</p>' : '') +
      (LEVEL === 'adults' ? '<p class="chartline">' + esc(chartNote(x)) + ' <a href="' + CHART + '#' + x.id + '">See it on the chart →</a></p>' : '') +
      (built.length ? '<div class="kin"><span class="kl">Built on</span>' + built.map(function (q) { return link(q); }).join('') + '</div>' : '') +
      (led.length ? '<div class="kin"><span class="kl">Led to</span>' + led.map(function (q) { return link(q); }).join('') + '</div>' : '') +
      (lost.length ? '<div class="kin"><span class="kl">Once forgotten</span>' + lost.map(function (q) { return link(q); }).join('') + '</div>' : '') +
      sources(t) +
      '</div></article>';
  }

  function renderHuman(p) {
    var h = p.human, t = TEXT[p.id] || {};
    return '<article class="spread" style="--c:var(--c-body)">' +
      plate(p.id, whenLong(h.year)) +
      '<div><p class="label"><span class="badge">Meet the inventors</span></p>' +
      '<h1 tabindex="-1">' + esc(nameOf(p)) + '</h1>' +
      '<p class="facts"><span><b>When:</b> ' + esc(when(h.year)) + '</span><span><b>Where:</b> ' + esc(h.where) + '</span></p>' +
      '<div class="story">' + paras(t, h.name) + '</div>' + boxes(t) + sources(t) +
      '</div></article>';
  }

  function renderLoss(p) {
    var l = p.loss, t = TEXT[p.id] || {};
    var techs = l.techs.map(function (id) { return BYID[id]; }).filter(Boolean);
    var back = l.regained ? 'Found again: ' + when(l.regained) : 'Never found again';
    return '<article class="spread lost" style="--c:var(--lost)">' +
      plate(p.id, whenLong(l.year), 'lost') +
      '<div><p class="label"><span class="badge lostb">' + L.lostBadge + '</span><span>' + L.lostTag + '</span></p>' +
      '<h1 tabindex="-1">' + esc(nameOf(p)) + '</h1>' +
      '<p class="facts"><span><b>When:</b> ' + esc(when(l.year)) + '</span><span><b>Where:</b> ' + esc(l.where) + '</span><span><b>' + esc(back) + '</b></span></p>' +
      '<div class="story">' + paras(t, l.desc) + '</div>' +
      boxes(t, true) +
      '<div class="box big"><h2>' + L.why + '</h2>' + esc(t.big || l.cause) + '</div>' +
      (techs.length ? '<div class="kin"><span class="kl">What was lost</span>' + techs.map(function (q) { return link(q); }).join('') + '</div>' : '') +
      sources(t) +
      '</div></article>';
  }

  function renderEnd() {
    var t = TEXT['the-end'] || {};
    return '<section class="spread endpage" style="--c:var(--c-ideas)">' +
      '<div class="plate">' + art('the-end') + '</div>' +
      '<div><p class="chapno">The end, for now</p><h1 tabindex="-1">' + esc(nameOf(BYID['the-end'])) + '</h1>' +
      '<div class="story">' + paras(t) + '</div>' + boxes(t) + sources(t) +
      '<div class="btns"><a class="btn main" href="#start">Back to the cover</a><a class="btn" href="#contents">Contents</a></div>' +
      '<p class="note" style="font-size:16px;color:var(--muted);margin-top:22px">The same inventions as an interactive chart, with sources, are at <a href="' + CHART + '">Human Inventions: the chart</a>.</p>' +
      '</div></section>';
  }

  function renderRibbon(p) {
    var total = PAGES.length;
    ribbon.innerHTML = CHAPTERS.map(function (c, i) {
      var a = FIRST_IN[c.n], b = i + 1 < CHAPTERS.length ? FIRST_IN[c.n + 1] : total - 1;
      var on = p.chapter === c;
      var you = on ? '<i class="you" style="left:' + (100 * (p.index - a + 0.5) / (b - a)).toFixed(2) + '%"></i>' : '';
      return '<a href="#chapter-' + c.n + '" style="flex:' + (b - a) + ' 1 0" class="' + (on ? 'on' : '') + '" title="Chapter ' + c.n + ': ' + esc(c.title) + '"' +
        (on ? ' aria-current="true"' : '') + '><span>' + esc(c.short) + '</span>' + you + '</a>';
    }).join('');
  }

  function renderPager(p) {
    var prev = PAGES[p.index - 1], next = PAGES[p.index + 1];
    pager.innerHTML =
      '<button class="prev" type="button"' + (prev ? '' : ' disabled') + ' aria-label="' + (prev ? 'Back to ' + esc(shortName(prev)) : 'Back') + '">← <span>Back<span class="nm">' + (prev ? ': ' + esc(shortName(prev)) : '') + '</span></span></button>' +
      '<span class="count">' + (p.index + 1) + ' of ' + PAGES.length + '</span>' +
      '<button class="next" type="button"' + (next ? '' : ' disabled') + ' aria-label="' + (next ? 'Next: ' + esc(shortName(next)) : 'Next') + '"><span>Next<span class="nm">' + (next ? ': ' + esc(shortName(next)) : '') + '</span></span> →</button>';
    pager.querySelector('.prev').onclick = function () { go(-1); };
    pager.querySelector('.next').onclick = function () { go(1); };
  }

  var current = null;
  function render(first) {
    var id = decodeURIComponent(location.hash.slice(1)) || 'start';
    var p = BYID[id] || BYID.start;
    current = p;
    var html;
    if (p.type === 'cover') html = renderCover();
    else if (p.type === 'contents') html = renderContents();
    else if (p.type === 'chapter') html = renderChapter(p.chapter);
    else if (p.type === 'end') html = renderEnd();
    else if (p.type === 'human') html = renderHuman(p);
    else if (p.type === 'loss') html = renderLoss(p);
    else html = renderTech(p);
    book.innerHTML = html;
    book.classList.remove('turn'); void book.offsetWidth; if (!first) book.classList.add('turn');
    renderRibbon(p); renderPager(p); renderLevels(p);
    var ch = p.chapter;
    whereEl.textContent = ch ? 'Chapter ' + ch.n + ' · ' + ch.title : '';
    document.title = (p.type === 'cover' ? '' : nameOf(p) + ' · ') + 'Human Inventions: the story' + (LEVEL === 'kids' ? '' : ' (' + L.name.replace(/^For a/, 'a') + ')');
    if (p.index > 1) save(p.id);
    if (!first) {
      window.scrollTo(0, 0);
      var h = book.querySelector('h1'); if (h) h.focus({ preventScroll: true });
    }
  }
  function go(d) {
    var q = PAGES[current.index + d];
    if (q) location.hash = q.id;
  }
  function save(id) { try { localStorage.setItem(L.key, id); } catch (e) { /* private mode */ } }
  function load() { try { return localStorage.getItem(L.key); } catch (e) { return null; } }

  window.addEventListener('hashchange', function () { render(false); });
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
  });
  var sx = null, sy = 0, st = 0;
  book.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { sx = null; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
  }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Date.now() - st < 700 && Math.abs(dx) > 70 && Math.abs(dy) < Math.abs(dx) * 0.5) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  // for the checker
  window.STORYBOOK = { level: LEVEL, pages: PAGES, text: TEXT, chapters: CHAPTERS, art: ART, nameOf: nameOf, when: when, whenLong: whenLong };
  render(true);
})();
