import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/opensearch-api': {
        target: 'https://opensearch.discovery.dor.lib.umich.edu',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/opensearch-api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path);
            // Add authentication header
            const credentials = 'admin:DiscOvery0!234dawg';
            const base64Credentials = Buffer.from(credentials).toString('base64');
            proxyReq.setHeader('Authorization', `Basic ${base64Credentials}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received response from OpenSearch:', proxyRes.statusCode);
          });
        }
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: ['discovery.dor.lib.umich.edu']
  }
})
