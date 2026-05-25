const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const PORT = 3000;
const PYTHON_API_PORT = 8000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/calculate", (req, res) => {
  const postData = JSON.stringify(req.body);

  const options = {
    hostname: "localhost",
    port: PYTHON_API_PORT,
    path: "/calculate",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let body = "";
    proxyRes.on("data", (chunk) => (body += chunk));
    proxyRes.on("end", () => {
      res.status(proxyRes.statusCode).json(JSON.parse(body));
    });
  });

  proxyReq.on("error", (err) => {
    console.error("Error reaching Python backend:", err.message);
    res.status(502).json({ error: "Python backend unavailable. Make sure main.py is running." });
  });

  proxyReq.write(postData);
  proxyReq.end();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, "public")}`);
});
