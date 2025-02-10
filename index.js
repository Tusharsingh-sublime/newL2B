const express = require("express");
const connected = require("./src/config/connection");
const app = express();
connected();
app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
