declare const worker: SharedWorkerServer;

export async function add(a: number, b: number) {
  console.log(worker.ports());
  return a + b;
}

export async function sub(a: number, b: number) {
  console.log(worker.ports());
  return a - b;
}
