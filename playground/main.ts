import { add } from './worker';

console.log(await add(1, 2));

// const worker = new SharedWorker(new URL('./worker/index.ts', import.meta.url), {
//   type: 'module',
//   name: 'worker'
// });
// worker.port.start();
// worker.port.postMessage('hello 1');
