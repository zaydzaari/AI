const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { exports: module.exports, module, require: name => load(path.resolve(path.dirname(file), name + '.ts')) }, { filename: file });
  cache.set(file, module.exports);
  return module.exports;
}
const { validateSettings, DEFAULTS, DIRECTIONS, VARIANTS, briefFor, defaultsFor } = load(path.resolve(__dirname, '../lib/studio.ts'));
test('untrusted URL/import settings cannot inject CSS or select arbitrary resources', () => {
  const s = validateSettings({ accent: '#fff; } body { display:none', ink: 'red', background: 'url(https://example.com)', headingFont: "x';background:red;", bodyFont: 'Unknown', image: 'https://example.com/x.png', variant: 'bad' });
  assert.equal(s.accent, ''); assert.equal(s.ink, ''); assert.equal(s.background, '');
  assert.equal(s.headingFont, 'original'); assert.equal(s.bodyFont, 'original'); assert.equal(s.image, 'auto'); assert.equal(s.variant, 'a');
});
test('imports recover from missing, malformed and extreme values without breaking layout', () => {
  for (const input of [null, undefined, false, 'bad', []]) assert.deepEqual(JSON.parse(JSON.stringify(validateSettings(input))), JSON.parse(JSON.stringify(DEFAULTS)));
  const s = validateSettings({ width: 99999, scale: -2, radius: -100, spacing: NaN, bodySize: Infinity, leading: 1, weight: '900' });
  assert.equal(s.width, 1440); assert.equal(s.scale, 75); assert.equal(s.radius, 0); assert.equal(s.spacing, 64); assert.equal(s.bodySize, 17); assert.equal(s.leading, 95); assert.equal(s.weight, 550);
});
test('a valid exported/shared configuration survives serialization exactly', () => {
  const saved = { ...DEFAULTS, variant: 'c', headingFont: 'Fraunces Variable', bodyFont: 'DM Sans Variable', image: 'paper-depth', accent: '#336633', background: '#f3f3ef', ink: '#182018', scale: 110, radius: 12, motion: 'off' };
  assert.deepEqual(JSON.parse(JSON.stringify(validateSettings(JSON.parse(JSON.stringify(saved))))), saved);
});
test('all twelve concepts have three named, distinct compositions and usable briefs', () => {
  assert.equal(Object.keys(DIRECTIONS).length, 12);
  for (const [id, d] of Object.entries(DIRECTIONS)) {
    assert.equal(new Set(d.names).size, 3);
    assert.equal(new Set(d.compositions).size, 3);
    for (const variant of VARIANTS) {
      const brief = briefFor(id, { ...DEFAULTS, variant });
      assert.ok(brief.includes(d.names[VARIANTS.indexOf(variant)]));
      assert.ok(brief.includes('Guardrails:')); assert.ok(brief.includes('Do not publish or modify GitHub.'));
    }
  }
});

test('authored type profiles restore correctly while explicit saved overrides survive', () => {
  const defaults = defaultsFor('01');
  const restored = validateSettings({}, defaults);
  assert.equal(restored.weight, 680); assert.equal(restored.width, 1280);
  const custom = validateSettings({ weight: 450, width: 1040 }, defaults);
  assert.equal(custom.weight, 450); assert.equal(custom.width, 1040);
  assert.notEqual(defaultsFor('04').weight, defaultsFor('12').weight);
  defaults.weight = 700; assert.equal(defaultsFor('01').weight, 680);
});
