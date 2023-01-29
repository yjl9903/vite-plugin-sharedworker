/// <reference lib="WebWorker" />

export function defineSharedWorker(self: SharedWorkerGlobalScope) {
  self.addEventListener('connect', (event) => {
    console.log('connect', event);
    const port = event.ports[0];
    port.addEventListener('message', (event) => {
      console.log('message', event);
    });
    port.start();
  });
}
