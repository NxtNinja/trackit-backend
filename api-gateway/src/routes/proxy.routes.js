const { createProxyMiddleware } = require("http-proxy-middleware");

const serviceRouter = {
  "/auth": "http://localhost:8081",
  "/transactions": "http://localhost:8082",
};

module.exports = (app) => {
  Object.entries(serviceRouter).forEach(([route, target]) => {
    app.use(
      route,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        logLevel: "debug",

        on: {
          proxyReq: (proxyReq, req) => {
            // forward user info
            if (req.user && req.user.userId) {
              proxyReq.setHeader("x-user-id", req.user.userId);
            }
          },
          error: (err, req, res) => {
            console.error("Proxy Error:", err.message);
            res.status(502).json({
              success: false,
              message:
                "Service temporarily unavailable. Please try again later.",
            });
          },
        },
      }),
    );
  });

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found in API Gateway",
    });
  });
};
