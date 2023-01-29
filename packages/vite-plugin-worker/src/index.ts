import { type Plugin, normalizePath } from 'vite';

import path from 'path';
import { findExports } from 'mlly';

export default function SharedWorker(options?: { root?: string }): Plugin {
  let root = process.cwd();
  const { root: workerRoot = './worker' } = options ?? {};

  return {
    name: 'vite-plugin-sharedworker:client',
    enforce: 'pre',
    configResolved(config) {
      root = normalizePath(path.join(config.root, workerRoot));
    },
    transform(code, id) {
      if (id.startsWith(root)) {
        const isClient = !id.endsWith('worker_file');

        // console.log(id);
        if (isClient) {
          const exports = findExports(code);

          return [
            `const worker = new SharedWorker(new URL(${JSON.stringify(
              id
            )}, import.meta.url), { type: 'module', name: 'worker' });`,
            `worker.port.start()`,
            ...exports
              .filter((ex) => ex.name)
              .map((ex) => `export const ${ex.name} = (...args: any[]) => {}`)
          ].join('\n');
        } else {
          const imports = [
            `// vite-plugin-sharedworker starts`,
            `import { defineSharedWorker } from 'vite-plugin-sharedworker/runtime'`,
            `defineSharedWorker(self)`,
            `// vite-plugin-sharedworker ends`,
            ''
          ];

          return imports.join('\n') + '\n' + code;
        }
      }
    }
  };
}
