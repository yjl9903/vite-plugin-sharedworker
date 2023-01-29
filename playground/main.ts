const worker1 = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  type: 'module'
});

worker1.port.start();

worker1.port.postMessage('hello 1');

const worker2 = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  type: 'module'
});

worker2.port.start();

worker2.port.postMessage('hello 2');

export {};
