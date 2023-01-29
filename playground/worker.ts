/// <reference lib="WebWorker" />

declare const self: SharedWorkerGlobalScope;

import { defineSharedWorker } from 'vite-plugin-sharedworker/runtime';

defineSharedWorker(self);

export type {};
