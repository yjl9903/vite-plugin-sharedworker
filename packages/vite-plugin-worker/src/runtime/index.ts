/// <reference lib="DOM" />
/// <reference lib="WebWorker" />

import type { SharedWorkerServer, SharedWorkerClient, MessageCallback } from './types';

import {
  makeRpcPayload,
  parsePayload,
  RpcPayload,
  makePingPayload,
  makeBroadcastPayload
} from './payload';

import { randomString } from './utils';

export * from './types';

export * from './payload';

type _SharedWorkerServer = SharedWorkerServer;
type _SharedWorkerClient = SharedWorkerClient;

declare global {
  export type SharedWorkerServer = _SharedWorkerServer;
  export type SharedWorkerClient = _SharedWorkerClient;
}

type Fn = (...args: any[]) => any;

export function defineSharedWorker(self: SharedWorkerGlobalScope, fns: Fn[]): SharedWorkerServer {
  // Filter function
  fns = fns.filter((fn) => typeof fn === 'function');

  const map = new Map<string, Fn>();
  for (const fn of fns) {
    map.set(fn.name, fn);
  }

  const ports = new Map<MessagePort, Date>();

  setInterval(() => {
    const now = new Date().getTime();
    for (const [port, date] of ports) {
      if (now - date.getTime() >= 2000) {
        ports.delete(port);
      }
    }
  }, 1000);

  const messageCallbacks: MessageCallback<any>[] = [];

  self.addEventListener('connect', (event) => {
    const port = event.ports[0];
    ports.set(port, new Date());

    port.addEventListener('message', async (event) => {
      const payload = parsePayload(event.data);
      if (payload) {
        if (payload.command === 'rpc') {
          const fn = map.get(payload.data.name);
          if (fn) {
            const result = await fn.apply(event, payload.data.args);
            port.postMessage(makeRpcPayload(payload.data.id, payload.data.name, result));
          } else {
            console.error(`Unknown message: ${JSON.stringify(payload, null, 2)}`);
          }
        } else if (payload.command === 'broadcast') {
          await Promise.all(messageCallbacks.map((fn) => fn.apply(event, [payload.data])));
        } else if (payload.command === 'ping') {
          ports.set(port, new Date());
        }
      }
    });

    port.start();
  });

  return {
    ports() {
      return [...ports.keys()];
    },
    dispatch(port, data: any) {
      port.postMessage(makeBroadcastPayload(data));
    },
    addMessageListener(fn) {
      messageCallbacks.push(fn);
    },
    broadcast(data: any) {
      for (const port of ports.keys()) {
        port.postMessage(makeBroadcastPayload(data));
      }
    }
  };
}

export function defineClientFactory(worker: SharedWorker) {
  worker.port.start();

  const callbacks = new Map<string, (payload: RpcPayload) => void>();
  const messageCallbacks: MessageCallback<any>[] = [];

  worker.port.addEventListener('message', async (event) => {
    const payload = parsePayload(event.data);
    if (payload) {
      if (payload.command === 'rpc') {
        const callback = callbacks.get(payload.data.id);
        if (callback) {
          callback(payload.data);
          callbacks.delete(payload.data.id);
        } else {
          console.error(`Unknown message: ${JSON.stringify(payload, null, 2)}`);
        }
      } else if (payload.command === 'broadcast') {
        await Promise.all(messageCallbacks.map((fn) => fn.apply(event, [payload.data])));
      }
    }
  });

  setInterval(() => {
    worker.port.postMessage(makePingPayload());
  }, 500);

  return {
    defineFunction(name: string) {
      return (...args: any[]) => {
        const id = randomString();
        const payload = makeRpcPayload(id, name, args);

        return new Promise((res) => {
          callbacks.set(id, (payload) => {
            res(payload.args);
          });
          worker.port.postMessage(payload);
        });
      };
    },
    defineClient(): SharedWorkerClient {
      return {
        addMessageListener(fn) {
          messageCallbacks.push(fn);
        },
        dispatch(data) {
          worker.port.postMessage(makeBroadcastPayload(data));
        }
      };
    }
  };
}
