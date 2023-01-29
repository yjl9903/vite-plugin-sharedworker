# vite-plugin-sharedworker

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

You just need to write functions and export them just like what you usually do.

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

Then you can just import your shared worker script just like what you usually do.

```ts
// src/main.ts

import { add, sub } from '../worker'

const a = await add(1, 2)
const b = await sub(2, 1)
```

You can see a full example [here](./playground/).

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
