const { spawnSync } = require('child_process');

console.log('Starting Bizboard API on ParsPack PaaS...');

spawnSync('corepack', ['enable'], { stdio: 'inherit' });

const result = spawnSync(
  'pnpm',
  ['--filter', '@bizboard/api', 'start:prod'],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
