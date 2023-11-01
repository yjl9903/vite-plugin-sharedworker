import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index', 'src/runtime'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true
  }
});
