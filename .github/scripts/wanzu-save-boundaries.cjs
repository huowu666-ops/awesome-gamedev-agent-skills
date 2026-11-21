const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

// Exercise the released implementation, not a duplicated validator.
const html = fs.readFileSync(process.argv[2], 'utf8');
const match = html.match(/<script id="v27-pixel-sim-js">([\s\S]*?)<\/script>/);
assert.ok(match, 'pixel simulation script must exist');
assert.ok(match[1].includes('window.V41='), 'test export anchor must exist');
const js = match[1].replace('window.V41=', 'window.auditValidate=validated;window.V41=');
const env = {
  window: {}, Image: class {},
  document: {readyState: 'loading', addEventListener() {}}, console,
  localStorage: {getItem() {return null;}, setItem() {}},
  requestAnimationFrame() {}, setTimeout() {}, clearTimeout() {}, structuredClone, Date
};
vm.runInNewContext(js, env);
const base = JSON.parse(JSON.stringify(env.window.V41.getState()));
const malformed = [undefined, null, false, true, '2', -1, 3, 1.5, {}, [], [null, '2', -1, 3], [1, 2, 1, 2]];
const days = [1, 7, 8, 14, 15, 21, 22, 28, 29, 50, 56, 57, 4999, 5000];
let cases = 0;
for (const day of days) for (const choices of malformed) for (const marker of malformed)
for (const winter of [undefined, null, -1, 0, 22, 28, 29, 5000, Infinity]) {
  const a = env.window.auditValidate({...base, day, riverChoices: choices,
    autumnLetterMarker: marker, winterReplyDay: winter}, {imported: true});
  assert.ok(a);
  assert.equal(a.riverChoices.length, 4);
  assert.ok(a.riverChoices.every(v => [0, 1, 2].includes(v)));
  assert.ok(a.autumnLetterMarker === null ||
    (a.riverChoices[2] && [0, 1, 2].includes(a.autumnLetterMarker)));
  if (a.winterReplyDay) {
    assert.ok(a.riverChoices[3]);
    assert.ok(a.winterReplyDay >= 22 && a.winterReplyDay <= a.day);
    assert.ok((a.winterReplyDay - 1) % 28 >= 21);
  }
  const b = env.window.auditValidate(JSON.parse(JSON.stringify(a)), {imported: true});
  for (const key of ['riverChoices', 'autumnLetterMarker', 'winterReplyDay'])
    assert.equal(JSON.stringify(a[key]), JSON.stringify(b[key]), key);
  cases++;
}
console.log(`PASS ${cases} imported story-field boundary and JSON round-trip cases`);
