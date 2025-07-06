const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage for development
let users = [];
let ceoCreated = false;

// Mock MongoDB for development
const mockDb = {
  collection: (name) => ({
    findOne: async (query) => {
      if (name === "users") {
        return users.find((user) => {
          if (query.email) return user.email === query.email;
          if (query.role) return user.role === query.role;
          if (query.$or) {
            return query.$or.some((condition) => {
              if (condition._id) return user._id === condition._id;
              if (condition.email) return user.email === condition.email;
              return false;
            });
          }
          return false;
        });
      }
      return null;
    },
    insertOne: async (doc) => {
      if (name === "users") {
        const newUser = { ...doc, _id: Date.now().toString() };
        users.push(newUser);
        return { insertedId: newUser._id };
      }
      return { insertedId: Date.now().toString() };
    },
    find: (query, options) => ({
      sort: () => ({
        toArray: async () => {
          if (name === "users") {
            return users.map((user) => {
              if (options?.projection?.password === 0) {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
              }
              return user;
            });
          }
          return [];
        },
      }),
    }),
  }),
};

// Auth endpoints
app.post("/api/auth", async (req, res) => {
  const { action } = req.query;

  try {
    if (action === "setup-ceo") {
      if (ceoCreated) {
        return res.status(400).json({ error: "CEO account already exists" });
      }

      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Hz3492k5$!", 12);

      const ceoUser = {
        name: "Alex Dowling",
        email: "AlexDowling@circuitdreamsstudios.com",
        password: hashedPassword,
        role: "CEO",
        position: "Chief Executive Officer",
        isAdmin: true,
        createdAt: new Date(),
        createdBy: "system",
      };

      await mockDb.collection("users").insertOne(ceoUser);
      ceoCreated = true;

      return res.status(201).json({
        message: "CEO account created successfully",
        email: ceoUser.email,
      });
    }

    if (action === "login") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await mockDb.collection("users").findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const bcrypt = require("bcryptjs");
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "dev-secret-key",
        { expiresIn: "8h" },
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          position: user.position,
          isAdmin: user.isAdmin,
        },
      });
    }

    if (action === "me") {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const token = authHeader.split(" ")[1];
      const jwt = require("jsonwebtoken");

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "dev-secret-key",
        );
        const user = await mockDb.collection("users").findOne({
          $or: [{ _id: decoded.id }, { email: decoded.email }],
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Auth API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Users endpoint
app.get("/api/users", (req, res) => {
  // Simple endpoint for development
  res.json(
    users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),
  );
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CircuitDreamsStudios Development API is running",
    usersCount: users.length,
    ceoCreated,
  });
});

// Auto-create CEO account on startup
async function initializeCEO() {
  if (!ceoCreated) {
    try {
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("Hz3492k5$!", 12);

      const ceoUser = {
        name: "Alex Dowling",
        email: "AlexDowling@circuitdreamsstudios.com",
        password: hashedPassword,
        role: "CEO",
        position: "Chief Executive Officer",
        isAdmin: true,
        createdAt: new Date(),
        createdBy: "system",
      };

      await mockDb.collection("users").insertOne(ceoUser);
      ceoCreated = true;
      console.log("✅ CEO account initialized");
    } catch (error) {
      console.error("❌ Failed to initialize CEO account:", error);
    }
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Development API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  await initializeCEO();
});
