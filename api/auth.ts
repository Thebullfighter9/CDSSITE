import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "CEO" | "Admin" | "TeamLead" | "Employee";
  position: string;
  isAdmin: boolean;
  createdAt: Date;
  createdBy: string;
}

interface TokenPayload {
  id?: string;
  email?: string;
  role: string;
}

export function verifyToken(req: VercelRequest): TokenPayload | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const token = header.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    // Setup CEO account (one-time route)
    if (req.method === "POST" && action === "setup-ceo") {
      const db = await getDb();

      // Check if CEO already exists
      const existingCEO = await db.collection("users").findOne({ role: "CEO" });
      if (existingCEO) {
        return res.status(400).json({ error: "CEO account already exists" });
      }

      const ceoData = {
        name: "Alex Dowling",
        email: "AlexDowling@circuitdreamsstudios.com",
        password: "Hz3492k5$!",
        role: "CEO" as const,
        position: "Chief Executive Officer",
        isAdmin: true,
        createdAt: new Date(),
        createdBy: "system",
      };

      const hashedPassword = await bcrypt.hash(ceoData.password, 12);
      const ceoUser = {
        ...ceoData,
        password: hashedPassword,
      };

      const result = await db.collection("users").insertOne(ceoUser);

      return res.status(201).json({
        message: "CEO account created successfully",
        id: result.insertedId,
        email: ceoData.email,
      });
    }

    // Login endpoint
    if (req.method === "POST" && action === "login") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const db = await getDb();
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
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

    // Register new user (CEO and Admins only)
    if (req.method === "POST" && action === "register") {
      const payload = verifyToken(req);
      if (!payload) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { name, email, password, role, position } = req.body;

      if (!name || !email || !password || !role || !position) {
        return res.status(400).json({
          error: "Name, email, password, role, and position are required",
        });
      }

      const db = await getDb();
      const currentUser = await db.collection("users").findOne({
        $or: [
          payload.id
            ? { _id: new ObjectId(payload.id) }
            : { email: payload.email },
          { email: payload.email },
        ],
      });

      if (!currentUser) {
        return res.status(401).json({ error: "User not found" });
      }

      // Role-based permission checks
      if (role === "Admin" && currentUser.role !== "CEO") {
        return res.status(403).json({
          error: "Only CEO can create Admin accounts",
        });
      }

      if (role === "TeamLead" && !["CEO", "Admin"].includes(currentUser.role)) {
        return res.status(403).json({
          error: "Only CEO or Admin can create TeamLead accounts",
        });
      }

      if (!["CEO", "Admin", "TeamLead"].includes(currentUser.role)) {
        return res.status(403).json({
          error: "Insufficient permissions to create user accounts",
        });
      }

      // Check if user already exists
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
        position,
        isAdmin: ["CEO", "Admin"].includes(role),
        createdAt: new Date(),
        createdBy: currentUser.email,
      };

      const result = await db.collection("users").insertOne(newUser);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: result.insertedId,
          name,
          email,
          role,
          position,
          isAdmin: newUser.isAdmin,
          createdBy: newUser.createdBy,
        },
      });
    }

    // Get current user info
    if (req.method === "GET" && action === "me") {
      const payload = verifyToken(req);
      if (!payload) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const db = await getDb();
      const user = await db.collection("users").findOne(
        {
          $or: [
            payload.id
              ? { _id: new ObjectId(payload.id) }
              : { email: payload.email },
            { email: payload.email },
          ],
        },
        { projection: { password: 0 } },
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Auth API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
