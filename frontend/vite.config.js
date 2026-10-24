import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React dev server runs on http://localhost:5173.
// Any request starting with /api is forwarded ("proxied") to Spring Boot on port 8080.
// Because the browser only ever talks to 5173, there are no CORS errors
// and you don't need to change anything in your Java code.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
