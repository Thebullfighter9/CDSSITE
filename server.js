const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import API handlers
const authHandler = require("./api/auth.ts").default;
const usersHandler = require("./api/users.ts").default;
const projectsHandler = require("./api/projects.ts").default;
const newsHandler = require("./api/news.ts").default;
const contactsHandler = require("./api/contacts.ts").default;
const statsHandler = require("./api/stats.ts").default;

// API Routes
app.use("/api/auth", (req, res) => authHandler(req, res));
app.use("/api/users", (req, res) => usersHandler(req, res));
app.use("/api/projects", (req, res) => projectsHandler(req, res));
app.use("/api/news", (req, res) => newsHandler(req, res));
app.use("/api/contacts", (req, res) => contactsHandler(req, res));
app.use("/api/stats", (req, res) => statsHandler(req, res));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "CircuitDreamsStudios API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CircuitDreamsStudios API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
