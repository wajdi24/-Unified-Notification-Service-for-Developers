import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables based on current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  console.log('VITE_BACKEND_URL:', env.VITE_BACKEND_URL);  // تحقق من القيمة هنا

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        // Proxy API calls to the backend
        '/api': {
          target: env.VITE_BACKEND_URL,  // تأكد من أن القيمة هنا صحيحة
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
