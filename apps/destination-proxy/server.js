const path = require("path");
const defaultEnv = require(path.join(__dirname, "default-env.json"));
process.env.VCAP_SERVICES = JSON.stringify(defaultEnv.VCAP_SERVICES);

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { getDestination } = require("@sap-cloud-sdk/connectivity");

const app = express();
const PORT = process.env.PORT || 5001;

let resolvedDestination = null;

async function resolveDestination() {
  console.log("[BTP] Resolving destination 'Northwind' via BTP Destination service...");

  const destination = await getDestination({ destinationName: "Northwind" });

  if (!destination || !destination.url) {
    throw new Error("Failed to resolve destination 'Northwind' from BTP. Check your destination service credentials and destination configuration.");
  }

  console.log(`[BTP] Destination 'Northwind' resolved successfully!`);
  console.log(`[BTP]   URL: ${destination.url}`);
  console.log(`[BTP]   Authentication: ${destination.authentication || "NoAuthentication"}`);
  console.log(`[BTP]   Proxy Type: ${destination.proxyType || "Internet"}`);

  return destination;
}

async function start() {
  try {
    resolvedDestination = await resolveDestination();
  } catch (err) {
    console.error("[BTP] Destination resolution failed:", err.message);
    process.exit(1);
  }

  app.use(
    "/V2",
    createProxyMiddleware({
      target: resolvedDestination.url,
      changeOrigin: true,
      pathRewrite: { "^/V2": "/V2" },
      on: {
        proxyReq: (proxyReq, req) => {
          console.log(`[PROXY] ${req.method} ${req.url} -> ${resolvedDestination.url}${req.url}`);
        },
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`[SERVER] Destination proxy running on http://localhost:${PORT}`);
    console.log(`[SERVER] Forwarding /V2/* -> ${resolvedDestination.url}/V2/*`);
  });
}

start();
