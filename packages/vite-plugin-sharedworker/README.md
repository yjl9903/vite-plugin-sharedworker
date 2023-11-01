# vite-plugin-sharedworker

[![CI](https://github.com/yjl9903/vite-plugin-sharedworker/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/vite-plugin-sharedworker/actions/workflows/ci.yml)
[![version](https://img.shields.io/npm/v/vite-plugin-sharedworker?label=vite-plugin-sharedworker)](https://www.npmjs.com/package/vite-plugin-sharedworker)

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

### Communication

Add `vite-plugin-sharedworker/runtime` to your tsconfig types.

Notice that you should create another tsconfig for your worker scirpts different from your client codes for the reason that they have different runtime.

```json
{
  "compilerOptions": {
    "types": [
      "vite-plugin-sharedworker/runtime"
    ]
  }
}
```

Or you can add this command to the beginning of your worker scripts.

```ts
/// <reference types="vite-plugin-sharedworker/runtime">
```

#### Worker to Client

The transform hook automatically add the `worker` global variable to your script. Add the following type declaration to make type inference work.

```ts
declare const worker: SharedWorkerServer
```

Then, you can listen the incoming messages.

```ts
worker.addMessageListener((payload) => {
  console.log(payload)
  // ...
})
```

Or you can broadcast messages.

```ts
worker.broadcast('Hello, this is worker')
```

Or you can send messages to a specific port.

```ts
const ports = worker.ports()
if (ports.length > 0) {
  worker.dispatch(ports[0], 'You are the first port')
}
```

#### Client to Worker

The transform hook automatically add the `client` global variable to your script. Add the following type declaration to make type inference work.

```ts
declare const client: SharedWorkerClient;

export const dispatch = client.dispatch;

export const addMessageListener = client.addMessageListener;
```

Then, in your client code, you can listen the incoming messages from the worker.

```ts
import { addMessageListener } from '<worker path>'

addMessageListener((payload) => {
  console.log(payload)
  // ...
})
```

Or send messages to the worker.

```ts
import { dispatch } from '<worker path>'

dispatch('Hello, this is client')
```

### Limitation

**This plugin has some side effects to your scripts (under the worker directory)**.

The transform hook adds the following global variables at the beginning of the input worker script, so that you can not re-define these variables at the global scope.

+ `worker`: used in the **worker** environment
+ `client`: used in the **client** environment
+ `dispatch`: used in the **client** environment
+ `addMessageListener`: used in the **client** environment

In the **worker** environment, you can only use the global variable `worker`. The reason for adding client-related variables is to make the module export type inference work. So you can just import the API `client`, `dispatch` and `addMessageListener` in your client code to do complex communications.

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
