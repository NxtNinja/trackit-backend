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
        xfwd: true, // Forward real client IP
        logLevel: "debug",

        on: {
          proxyReq: (proxyReq, req) => {
            // Forward the internal service key to prove request origin
            proxyReq.setHeader(
              "x-internal-service-key",
              process.env.INTERNAL_SERVICE_KEY
            );

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
