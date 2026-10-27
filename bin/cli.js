#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { generateTheme } from '../src/index.js';
try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    color: { type: 'string' }, name: { type: 'string' }, json: { type: 'boolean' },
    help: { type: 'boolean', short: 'h' },
  } });
  if (values.help) console.log('Uso: node bin/cli.js --color "#0a63ff" [--name brand] [--json]');
  else {
    if (positionals.length) throw new Error('Use --color para informar a cor.');
    const theme = generateTheme(values.color, values.name);
    process.stdout.write(values.json ? JSON.stringify(theme, null, 2) + '\n' : theme.css);
  }
} catch (error) { console.error('Erro: ' + error.message); process.exitCode = 1; }
