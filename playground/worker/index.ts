declare const worker: SharedWorkerServer;

declare const client: SharedWorkerClient;

export const dispatch = client.dispatch;

export const addMessageListener = client.addMessageListener;

setInterval(() => {
  console.log('Hello');
  worker.broadcast('Hello, this is sharedworker');
}, 2000);

export async function add(a: number, b: number) {
  console.log(worker.ports());
  return a + b;
}

export async function sub(a: number, b: number) {
  console.log(worker.ports());
  return a - b;
}
