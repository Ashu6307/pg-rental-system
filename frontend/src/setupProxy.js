const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('✅ Setting up proxy for /api routes to http://localhost:5000');
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function (proxyReq, req, res) {
        console.log('🔄 Proxying request:', req.method, req.url);
      },
      onProxyRes: function (proxyRes, req, res) {
        console.log('✅ Proxy response received:', proxyRes.statusCode, 'for', req.url);
      },
      onError: function (err, req, res) {
        console.error('❌ Proxy error for', req.url, ':', err.message);
      }
    })
  );
  
  console.log('✅ Proxy middleware registered successfully');
};
