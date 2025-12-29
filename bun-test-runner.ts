/**
 * Bun test runner wrapper
 *
 * Angular components with external templates require Vite's Angular plugin for compilation.
 * This preload script runs vitest instead of Bun's native test runner.
 */

import { spawnSync } from 'bun';

const result = spawnSync(['bun', 'run', 'vitest', 'run'], {
  cwd: import.meta.dir,
  stdio: ['inherit', 'inherit', 'inherit'],
});

process.exit(result.exitCode ?? 0);
