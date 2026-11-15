import type { NextConfig } from "next";

// The site is static and loads nothing from other origins: scripts, styles, fonts and images
// all come from this host. Inline scripts and styles stay allowed because Next's hydration
// data and the scene's positioning use them, and a static page cannot carry a per-request nonce.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const everywhere = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    // Development needs eval for hot reload, so the policy is applied to production builds only.
    if (process.env.NODE_ENV !== "production") return [];
    return [
      { source: "/:path*", headers: everywhere },
      // Pages only. The resume keeps the browser's own PDF viewer free of the page policy.
      { source: "/((?!.*\\.pdf$).*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
    ];
  },
};

export default nextConfig;
