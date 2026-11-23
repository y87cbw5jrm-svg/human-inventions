// Checks the dataset: node validate.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('./data.js', import.meta.url), 'utf8');
const ctx = { window: {} };
vm.runInNewContext(src, ctx);
const { now, cats, techs, ages, losses, unknownIds } = ctx.window.INVENTIONS;
const catIds = new Set(cats.map(c => c.id));
const ids = new Set();
let errors = 0;
const fail = (t, msg) => { errors++; console.error(`✗ ${t.id}: ${msg}`); };

for (const t of techs) {
  if (ids.has(t.id)) fail(t, 'duplicate id');
  ids.add(t.id);
  if (!/^[a-z0-9-]+$/.test(t.id)) fail(t, 'id must be lowercase letters, digits and hyphens');
  if (!catIds.has(t.cat)) fail(t, `unknown category ${t.cat}`);
  if (![1, 2, 3].includes(t.q)) fail(t, 'q must be 1, 2 or 3');
  if (!t.desc || t.desc.length < 40) fail(t, 'description missing or too short');
  if (!t.where) fail(t, 'where missing');
  if (t.kind === 'event') {
    if (t.pts) fail(t, 'an event has no points');
    if (!(t.first <= now)) fail(t, 'event date after now');
    continue;
  }
  const p = t.pts;
  if (!Array.isArray(p) || p.length < 2) { fail(t, 'needs at least two points'); continue; }
  if (p[0][1] !== 0) fail(t, 'first point must be 0%');
  for (let i = 0; i < p.length; i++) {
    const [y, v] = p[i];
    if (!(v >= 0 && v <= 100)) fail(t, `value out of range at ${y}`);
    if (y > now) fail(t, `point after ${now}`);
    if (i && !(y > p[i - 1][0])) fail(t, `years not increasing at index ${i} (${p[i - 1][0]} → ${y})`);
  }
  if (t.first < p[0][0]) fail(t, 'first evidence is earlier than the curve origin');
  if (t.first > p[p.length - 1][0]) fail(t, 'first evidence after the last point');
}
for (const id of [...new Set(unknownIds || [])]) { errors++; console.error(`✗ reference to unknown id ${id}`); }
// prerequisites must already exist when the invention appears, and the graph must have no cycles
const byId = new Map(techs.map(t => [t.id, t]));
const origin = t => t.pts ? t.pts[0][0] : t.first;
for (const t of techs) for (const id of t.on || []) {
  const p = byId.get(id);
  if (p && origin(p) > t.first) fail(t, `built on ${id}, which appears later`);
}
const seen = new Map();
const visit = (t, stack) => {
  if (stack.includes(t.id)) { errors++; console.error(`✗ cycle: ${[...stack, t.id].join(' → ')}`); return; }
  for (const id of t.on || []) if (byId.get(id)) visit(byId.get(id), [...stack, t.id]);
};
techs.forEach(t => visit(t, []));
for (const l of losses || []) {
  if (!l.techs.length) { errors++; console.error(`✗ loss ${l.id} names no technology`); }
  if (l.regained != null && l.regained <= l.year) { errors++; console.error(`✗ loss ${l.id} regained before it was lost`); }
}
for (let i = 1; i < (ages || []).length; i++) if (ages[i].from !== ages[i - 1].to) { errors++; console.error(`✗ ages ${i - 1} and ${i} do not join`); }
const events = techs.filter(t => t.kind === 'event');
console.log(`${techs.length - events.length} technologies with usage lines and ${events.length} discoveries in ${cats.length} categories`);
console.log(`${techs.filter(t => t.key).length} milestones, ${techs.filter(t => t.shift).length} mental shifts, ${techs.filter(t => t.on && t.on.length).length} with prerequisites, ${(losses || []).length} losses`);
for (const c of cats) console.log(`  ${c.name}: ${techs.filter(t => t.cat === c.id).length}`);
if (errors) { console.error(`${errors} problem(s)`); process.exit(1); }
console.log('OK');
