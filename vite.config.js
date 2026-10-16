import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import trackHandler from './api/track.js';
import statsHandler from './api/stats.js';
import identifyHandler from './api/identify.js';
import adminAnalyticsHandler from './api/admin/analytics.js';
import adminPurgeHandler from './api/admin/purge.js';
import adminLoginHandler from './api/admin/login.js';

// Vite dev server middleware to emulate Vercel serverless /api routes in local development
function apiDevServerPlugin(env) {
  Object.assign(process.env, env);

  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        if (!pathname.startsWith('/api/')) {
          return next();
        }

        // Add standard Vercel serverless response helpers
        res.status = function (code) {
          res.statusCode = code;
          return res;
        };
        res.json = function (obj) {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json');
          }
          res.end(JSON.stringify(obj));
          return res;
        };

        try {
          if (pathname === '/api/track') {
            return await trackHandler(req, res);
          } else if (pathname === '/api/stats') {
            return await statsHandler(req, res);
          } else if (pathname === '/api/identify') {
            return await identifyHandler(req, res);
          } else if (pathname === '/api/admin/login') {
            return await adminLoginHandler(req, res);
          } else if (pathname === '/api/admin/analytics') {
            return await adminAnalyticsHandler(req, res);
          } else if (pathname === '/api/admin/purge') {
            return await adminPurgeHandler(req, res);
          } else {
            return res.status(404).json({ error: 'API route not found' });
          }
        } catch (err) {
          console.error('API dev server error:', err);
          return res.status(500).json({ error: err.message || 'Internal API Error' });
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), apiDevServerPlugin(env)],
    server: {
      port: 3000,
      open: false,
      host: true,
      watch: {
        ignored: ['**/*.docx', '**/*.pdf', '**/*.jpeg', '**/*.jpg'],
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
