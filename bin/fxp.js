#!/usr/bin/env node
import('../src/index.js')
  .then(m => (m.default ? m.default(process.argv) : null))
  .catch(err => {
    console.error(err?.stack || err?.message || String(err));
    process.exit(1);
  });
