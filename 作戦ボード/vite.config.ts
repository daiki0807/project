import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/project/', // この行を追加
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});