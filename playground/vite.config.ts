import { defineConfig } from 'vite';
import cssp from '../src/vite.plugin-cssp';

export default defineConfig({
  root: __dirname,
  plugins: [cssp()],
})