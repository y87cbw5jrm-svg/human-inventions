# Human Inventions: how technology spread, from the first fire to today

**Live site: https://y87cbw5jrm-svg.github.io/human-inventions/**

**Picture book for ages 8 to 12: https://y87cbw5jrm-svg.github.io/human-inventions/story/**

An interactive timeline of 151 technologies and 20 key discoveries, from Lomekwian stone tools (3.3 million years ago) to generative AI. It is inspired by the "Consumption spreads faster today" chart of U.S. household adoption. Each line is the estimated **share of all people alive** who used the technology, or lived in a community that did. That measure works across the whole span, so the Stone Age and the smartphone sit on one axis.

## What you can do

- **Curves**: one line per technology, like the original chart. Choose milestones, mental shifts or everything, switch between a log and a linear time axis, jump to a period (all time, 100,000 years, since farming, since 1 CE, since 1750, since 1900), drag to pan, and pinch, Ctrl/⌘ + scroll or double-click to zoom.
- **Rows**: every technology on its own row, sorted by age, category, current use or speed of spread.
- **Mental shifts (✦)**: 41 technologies that changed how people think or live, from fire and money to the pill and the mobile phone, each with a line on what shifted.
- **Discoveries (◆)**: ideas and firsts with a date but no usage line (DNA, germ theory, cognitive biases, the circadian clock, the Moon landing and more), shown as diamonds above the chart.
- **Ages and human origins**: shaded bands for the ages of technology (Stone, Metal, Water and wind, Industrial, Electric, Electronic, Information, after Ken Funk's outline of the history of technology), and lines marking the first members of the genus Homo (2.8 million years ago) and of Homo sapiens (300,000 years ago). Deep-time entries say which human species made them.
- **Collective brain**: following Joseph Henrich's cumulative-culture view, every invention lists what it was **built on** and what it **led to**, and any invention's full family tree can be drawn back to the first stone tools. Selecting an invention lights up its prerequisites on the timeline.
- **Progress can be lost (▽)**: twelve episodes where know-how disappeared, from Tasmania and the Bronze Age collapse to post-Roman Britain, the Polar Inuit, the last Moon landing and Concorde, each with its cause and whether it was regained.
- **Readout**: hover anywhere to see what share of people used each technology in that year. Click a line for its story: first evidence, site, when it reached 10%, 50% and 90%, peak and decline.
- **Speed**: years from first appearance to 10%, 25% or 50% of humanity, plotted against when each technology appeared, with medians by era.
- **Table**: every technology with sortable dates and shares. It is also the accessible version of the chart.
- Links to a technology work: `index.html#iron`.

## The picture book (`story/`)

A children's encyclopedia that tells the same history as a story, one page per invention, in time order. It has 197 pages: a cover, contents, nine chapters by age (from "Before people like us" to "The Information Age"), every technology and discovery in the dataset, the two human milestones, the twelve times know-how was lost, and an ending ("What will you invent?").

- Each page has a drawn illustration, the date and place of the first evidence, a short story written for 8 to 12-year-olds, a "Wow!" fact, the big idea for mental shifts, how many people use it today, and links to what it was built on and what it led to.
- Turn pages with the Back and Next buttons, the arrow keys or a swipe. The ribbon at the top shows where you are in history, and the book remembers the last page you read.
- `story/stories-a.js` (chapters 1 to 4) and `story/stories-b.js` (chapters 5 to 9) hold the text in a simple format: `@page-id`, then paragraphs, then lines starting `!` (Wow fact), `*` (big idea), `=` (today), `>` (who made it) or `#` (title).
- `story/art.js` draws every picture from one small kit of shapes; `story/story.js` builds the pages from `data.js`.

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure and the method text |
| `styles.css` | Layout and light/dark themes |
| `data.js` | The dataset: categories, and per technology the first evidence, site, confidence, adoption anchor points and description |
| `app.js` | Charts and interaction (vanilla JS, canvas and SVG, no dependencies) |
| `validate.mjs` | Checks the dataset: `node validate.mjs` |
| `logo.svg`, `og.png` | The logo and the link-preview image |
| `story/` | The picture book: `index.html`, `story.css`, `story.js` (book engine), `art.js` (illustrations), `stories-a.js` and `stories-b.js` (text), `og.png` |

## Running

No build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Editing the data

Each entry in `data.js` is one `t(...)` call:

```js
t('iron', 'Iron', 'tools', -1800, 'Anatolia', 3, 1,
  [[-1800, 0], [-1200, 3], [-1000, 12], ... [2025, 100]],
  'Description…');
```

- Years are calendar years, with BCE as negative numbers. Use `A(n)` for "n years ago" in deep time.
- The first anchor point is the estimated origin at 0%. Years must increase. Curves are drawn with monotone cubic interpolation, so they never overshoot the anchors.
- `q` is confidence: 1 measured (survey and census data for recent decades), 2 estimated, 3 reconstructed from archaeology.
- For a discovery with no usage line, use `ev(id, name, cat, year, where, key, desc)` instead.
- Prerequisites (`ON`), loss episodes (`LOSSES`), world population (`POP`), mental-shift notes (`SHIFT`), the human species behind deep-time finds (`BY`) and lines measured differently, by country or by share of world energy (`MEASURE`) are maps near the end of the file.
- Set `key` to 1 to show the technology in the Milestones view.

Run `node validate.mjs` after editing.

## Caveats

Modern lines draw on the ITU, IEA, World Bank, WHO/UNICEF JMP, UN, UNESCO, GSMA and Global Findex. Prehistoric and ancient lines are reconstructions from the archaeological record and regional population estimates. They show the order of magnitude of how fast things spread, not precise percentages. First-evidence dates are the oldest accepted finds as of early 2026 and keep moving back as new sites are dug.
