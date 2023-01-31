import 'uno.css';
import '@onekuma/reset/tailwind.css';

import { add, sub, addMessageListener } from '../worker';

addMessageListener((data) => {
  console.log(data);
});

async function bootstrap() {
  console.log(await add(1, 2));
  console.log(await sub(2, 1));
}

function register() {
  const input1 = document.getElementById('ia')! as HTMLInputElement;
  const input2 = document.getElementById('ib')! as HTMLInputElement;
  const result = document.getElementById('result')!;

  const addBtn = document.getElementById('add')!;
  const subBtn = document.getElementById('sub')!;

  addBtn.addEventListener('click', async () => {
    const r = await add(+input1.value, +input2.value);
    result.innerText = String(r);
  });
  subBtn.addEventListener('click', async () => {
    const r = await sub(+input1.value, +input2.value);
    result.innerText = String(r);
  });
}

bootstrap();
register();

// const worker = new SharedWorker(new URL('./worker/index.ts', import.meta.url), {
//   type: 'module',
//   name: 'worker'
// });
// worker.port.start();
// worker.port.postMessage('hello 1');
