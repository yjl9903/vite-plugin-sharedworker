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

        const exports = findExports(code).filter((ex) => !!ex.name);

        if (isClient) {
          const workerName = path.basename(id.split('?')[0]);
          return [
            `// vite-plugin-sharedworker starts`,
            `import { defineClient } from 'vite-plugin-sharedworker/runtime'`,
            `const worker = new SharedWorker(new URL(${JSON.stringify(
              id
            )}, import.meta.url), { type: 'module', name: ${JSON.stringify(workerName)} });`,
            `const client = defineClient(worker)`,
            `// vite-plugin-sharedworker ends`,
            ...exports.map(
              (ex) => `export const ${ex.name} = client.defineFunction(${JSON.stringify(ex.name)})`
            )
          ].join('\n');
        } else {
          const imports = [
            `// vite-plugin-sharedworker starts`,
            `import { defineSharedWorker } from 'vite-plugin-sharedworker/runtime'`,
            `defineSharedWorker(self, [${exports.map((ex) => ex.name!).join(', ')}])`,
            `// vite-plugin-sharedworker ends`,
            ''
          ];

          return imports.join('\n') + '\n' + code;
        }
      }
    }
  };
}
