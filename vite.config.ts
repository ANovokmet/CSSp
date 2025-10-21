import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import commonjs from "vite-plugin-commonjs";
import pkg from './package.json' assert { type: 'json' };

// Recreate __dirname in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({command}) => ({
  mode: 'development',
  base: command === 'build' ? '/CSSp/' : '/', // 👈 only use subpath on build
  plugins: [commonjs()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'), // include index.html
    },
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CSSp',
      fileName: () => 'cssp.js',
      formats: ['umd'],
    },
  },
}));