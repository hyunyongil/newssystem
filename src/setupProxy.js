const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/passApi',
    createProxyMiddleware({
      target: 'https://passport.baidu.com',
      changeOrigin: true,
    })
  );
};