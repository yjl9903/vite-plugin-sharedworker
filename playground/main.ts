import { add, sub } from './worker';

async function bootstrap() {
  console.log(await add(1, 2));
  console.log(await sub(2, 1));
}

bootstrap();

// const worker = new SharedWorker(new URL('./worker/index.ts', import.meta.url), {
//   type: 'module',
//   name: 'worker'
// });
// worker.port.start();
// worker.port.postMessage('hello 1');
