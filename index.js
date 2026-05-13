const { spawnSync } = require('child_process');

console.log('Starting Bizboard API on ParsPack PaaS...');

const result = spawnSync(
  'node',
  ['apps/api/dist/main.js'],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
