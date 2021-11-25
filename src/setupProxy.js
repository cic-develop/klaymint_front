// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/ipfs',
        createProxyMiddleware({
            target: 'https://ipfs.io',
            changeOrigin: true,
        }),
    );
};
