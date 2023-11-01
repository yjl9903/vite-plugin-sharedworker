declare const worker: SharedWorkerServer;

declare const client: SharedWorkerClient;

export const dispatch = client.dispatch;

export const addMessageListener = client.addMessageListener;

worker.addMessageListener((payload) => {
  console.log('Receive:', payload);
});

setInterval(() => {
  worker.broadcast('Hello, this is sharedworker');
}, 5000);

export async function add(a: number, b: number) {
  console.log(worker.ports());
  return a + b;
}

export async function sub(a: number, b: number) {
  console.log(worker.ports());
  return a - b;
}
