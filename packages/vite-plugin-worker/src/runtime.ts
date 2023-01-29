/// <reference lib="DOM" />
/// <reference lib="WebWorker" />

import { randomString } from './utils';

type Fn = (...args: any[]) => any;

export function defineSharedWorker(self: SharedWorkerGlobalScope, fns: Fn[]) {
  const map = new Map<string, Fn>();
  for (const fn of fns) {
    map.set(fn.name, fn);
  }

  self.addEventListener('connect', (event) => {
    const port = event.ports[0];

    port.addEventListener('message', async (event) => {
      const payload = parsePayload(event.data);
      const fn = map.get(payload.name);
      if (fn) {
        const result = await fn.apply(event, payload.arguments);
        port.postMessage(makePayload(payload.id, payload.name, result));
      } else {
        console.error(`Unknown message: ${JSON.stringify(payload, null, 2)}`);
      }
    });

    port.start();
  });
}

export function defineClient(worker: SharedWorker) {
  worker.port.start();

  const callbacks = new Map<string, (payload: Payload) => void>();

  worker.port.addEventListener('message', (event) => {
    const payload = parsePayload(event.data);
    const callback = callbacks.get(payload.id);
    if (callback) {
      callback(payload);
    } else {
      console.error(`Unknown message: ${JSON.stringify(payload, null, 2)}`);
    }
  });

  return {
    defineFunction(name: string) {
      return (...args: any[]) => {
        const id = randomString();
        const payload = makePayload(id, name, args);

        return new Promise((res) => {
          callbacks.set(id, (payload) => {
            res(payload.arguments);
          });
          worker.port.postMessage(payload);
        });
      };
    }
  };
}

interface Payload {
  id: string;
  name: string;
  arguments: any;
}

function makePayload(id: string, name: string, args: any) {
  return JSON.stringify({
    i: id,
    f: name,
    a: args
  });
}

function parsePayload(payload: string) {
  const p = JSON.parse(payload);
  return {
    id: p.i,
    name: p.f as string,
    arguments: p.a as any[]
  };
}
