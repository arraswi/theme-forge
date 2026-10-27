import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { normalizeHex, contrastRatio, generateTheme } from '../src/index.js';
const cli = (...args) => spawnSync(process.execPath, ['bin/cli.js', ...args], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
test('normaliza cores curtas e caixa', () => {
  assert.equal(normalizeHex('#AbC'), '#aabbcc');
  assert.equal(normalizeHex('#0A63FF'), '#0a63ff');
});
test('rejeita cor inválida e nome que injeta CSS', () => {
  for (const color of ['red', '#12', '#zzzzzz', '#12345678', null]) assert.throws(() => generateTheme(color));
  assert.throws(() => generateTheme('#fff', 'x; color:red'));
});
test('contraste entre preto e branco é 21 e mesma cor é 1', () => {
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#abc', '#abc'), 1);
  assert.equal(contrastRatio('#abc', '#123'), contrastRatio('#123', '#abc'));
});
test('escala mantém a base no passo 500 e gera 10 tons', () => {
  const t = generateTheme('#0a63ff', 'niyo');
  assert.equal(t.colors[500], '#0a63ff');
  assert.equal(Object.keys(t.colors).length, 10);
  assert.match(t.css, /--niyo-500: #0a63ff;/);
  assert.match(t.css, /--on-niyo:/);
});
test('texto escolhido maximiza contraste com a base', () => {
  assert.equal(generateTheme('#000').onBase, '#ffffff');
  assert.equal(generateTheme('#fff').onBase, '#000000');
  for (const c of ['#0a63ff', '#888', '#f00', '#00ff00']) assert.ok(generateTheme(c).contrast >= 4.5);
});
test('CLI exporta CSS e JSON, ajuda e erros retornam códigos corretos', () => {
  const result = cli('--color', '#abc', '--json');
  assert.equal(result.status, 0); assert.equal(JSON.parse(result.stdout).base, '#aabbcc');
  assert.match(cli('--color', '#fff').stdout, /:root/);
  assert.equal(cli('--help').status, 0);
  assert.equal(cli('--color', 'invalid').status, 1);
  assert.equal(cli().status, 1);
});
