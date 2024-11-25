import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

// Create two separate configs for CJS and ESM
const createConfig = (format, dir) => ({
  input: 'src/index.ts',
  output: {
    dir,
    format,
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src',
    ...(format === 'cjs' && { exports: 'named', entryFileNames: '[name].cjs' }),
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: dir,
      rootDir: './src',
      outDir: dir,
    }),
    terser(),
  ],
  external: ['@iabtechlabtcf/core'],
});

export default [
  createConfig('cjs', 'dist/cjs'),
  createConfig('esm', 'dist/esm'),
];
