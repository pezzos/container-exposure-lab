import http from "node:http";

const port = Number.parseInt(process.env.PORT || "8080", 10);
const host = "0.0.0.0";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Container Exposure Lab</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        align-items: center;
        display: grid;
        margin: 0;
        min-height: 100vh;
        padding: 2rem;
      }
      main {
        max-width: 42rem;
      }
      code {
        font: inherit;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Container Exposure Lab</h1>
      <p>This disposable HTTP app is running for a temporary tunnel experiment.</p>
      <p>Health endpoint: <code>/healthz</code></p>
    </main>
  </body>
</html>
`;

const send = (res, statusCode, headers, body, method) => {
  res.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });

  if (method !== "HEAD") {
    res.end(body);
    return;
  }

  res.end();
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(
      res,
      405,
      { "Content-Type": "application/json; charset=utf-8", Allow: "GET, HEAD" },
      JSON.stringify({ error: "method_not_allowed" }),
      req.method,
    );
    return;
  }

  if (url.pathname === "/healthz") {
    send(
      res,
      200,
      { "Content-Type": "application/json; charset=utf-8" },
      JSON.stringify({ ok: true, service: "container-exposure-lab" }),
      req.method,
    );
    return;
  }

  if (url.pathname === "/") {
    send(res, 200, { "Content-Type": "text/html; charset=utf-8" }, html, req.method);
    return;
  }

  send(
    res,
    404,
    { "Content-Type": "application/json; charset=utf-8" },
    JSON.stringify({ error: "not_found" }),
    req.method,
  );
});

server.listen(port, host, () => {
  console.log(`container-exposure-lab listening on ${host}:${port}`);
});
