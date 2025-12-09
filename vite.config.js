import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  // Use environment variables with fallbacks
  const opensearchUrl = env.VITE_OPENSEARCH_URL || 'http://opensearch:9200'
  const opensearchCredentials = env.VITE_OPENSEARCH_CREDENTIALS || 'admin:password'

  return {
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
          target: opensearchUrl,
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
              const base64Credentials = Buffer.from(opensearchCredentials).toString('base64');
              proxyReq.setHeader('Authorization', `Basic ${base64Credentials}`);
              console.log('Authorization header added');
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received response from OpenSearch:', proxyRes.statusCode);
            });
          }
        },
      },
      allowedHosts: ['discovery.dor.lib.umich.edu']
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      proxy: {
        '/opensearch-api': {
          target: opensearchUrl,
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
              const base64Credentials = Buffer.from(opensearchCredentials).toString('base64');
              proxyReq.setHeader('Authorization', `Basic ${base64Credentials}`);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received response from OpenSearch:', proxyRes.statusCode);
            });
          }
        },
      },
      allowedHosts: ['discovery.dor.lib.umich.edu']
    }
  }
})
