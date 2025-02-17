const express = require("express");
const connected = require("./src/config/connection");
const loginRouter = require("./src/routes/V1/Admin/loginRouter");
const UserRouter = require("./src/routes/V1/Admin/userRouter");
const LeadsRouter = require("./src/routes/V1/Admin/leadsRouter");
const followUpRouter = require("./src/routes/V1/Admin/followUp");
const app = express();

// Connect to the database
connected()
  .then(() => console.log("Database connected successfully"))
  .catch((error) =>
    console.error("Database connection failed:", error.message)
  );

// Middleware to parse incoming JSON requests
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

// API routes
app.use("/api/v1/admin", loginRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/lead", LeadsRouter);
app.use("/api/v1/followup", followUpRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
