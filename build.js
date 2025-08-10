#!/usr/bin/env node
// Legacy build script - redirects to new build system
import chalk from 'chalk';

console.log(chalk.yellow('⚠️  build.js is deprecated. Use: npm run build'));
console.log(chalk.gray('Redirecting to new build system...'));

import('./scripts/build.js').catch(console.error);
