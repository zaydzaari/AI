// Zero-dependency static server for the collection.
//   node awwwards-20-collection/serve.mjs [port]   →   http://localhost:4320/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 4320);
const HOST = process.env.HOST || "127.0.0.1"; // local only by default; set HOST=0.0.0.0 to share on your LAN
const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".woff2": "font/woff2", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".js": "text/javascript", ".css": "text/css", ".mjs": "text/javascript" };

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, path.normalize(p));
    if (!file.startsWith(ROOT) || p.includes("/_build/")) return res.writeHead(403).end("Forbidden");
    fs.stat(file, (err, st) => {
      if (!err && st.isDirectory()) return res.writeHead(301, { Location: p + "/" }).end();
      if (err) return res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
      fs.createReadStream(file).pipe(res);
    });
  })
  .listen(PORT, HOST, () => console.log(`Awwwards 20 Collection → http://localhost:${PORT}/`));
