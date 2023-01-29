import { defineConfig } from 'vite';

import BuildInfo from 'vite-plugin-info';
import SharedWorkerClient from 'vite-plugin-sharedworker';

export default defineConfig({
  plugins: [BuildInfo(), SharedWorkerClient()]
});
