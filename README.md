# vite-plugin-sharedworker

[![CI](https://github.com/yjl9903/vite-plugin-sharedworker/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/vite-plugin-sharedworker/actions/workflows/ci.yml) [![version](https://img.shields.io/npm/v/vite-plugin-sharedworker?color=rgb%2850%2C203%2C86%29&label=vite-plugin-sharedworker)](https://www.npmjs.com/package/vite-plugin-sharedworker)

Make [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) works like Remote Procedure Call easily.

## Installation

```bash
npm i -D vite-plugin-sharedworker
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import SharedWorker from 'vite-plugin-sharedworker'

export default defineConfig({
  plugins: [
    SharedWorker()
  ]
})
```

## Usage

Create a directory used for shared workers (default is `./worker/`). All the scripts in this directory will be transformed as RPC shared worker.

You can just write functions and export them like what you usually do.

```ts
// worker/index.ts

export async function add(a: number, b: number) {
  return a + b
}

export async function sub(a: number, b: number) {
  return a - b
}
```

> **Note**
>
> To make TypeScript return type work fine, you must export **async** functions, even if they are sync.

Then you can just import your shared worker script like what you usually do.

This plugin will transform your method call to send message to the shared worker, and receive return value from the shared worker. Note that all the messages are serialized as JSON.

```ts
// src/main.ts

import { add, sub } from '../worker'

const a = await add(1, 2)
const b = await sub(2, 1)
```

You can see a full example [here](./playground/).

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
