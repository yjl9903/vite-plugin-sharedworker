// /// <reference lib="WebWorker" />
// declare const self: SharedWorkerGlobalScope;
// import { defineSharedWorker } from 'vite-plugin-sharedworker/runtime';
// defineSharedWorker(self);
// export type {};

export async function add(a: number, b: number) {
  return a + b;
}

export async function sub(a: number, b: number) {
  return a - b;
}
