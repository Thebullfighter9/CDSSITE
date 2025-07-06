import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import { verifyToken } from "./auth";

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

  const payload = verifyToken(req);
  if (!payload) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
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

    // GET /api/users - List all users (protected route)
    if (req.method === "GET") {
      // Only CEO, Admin, and TeamLead can view user lists
      if (!["CEO", "Admin", "TeamLead"].includes(currentUser.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      const { id } = req.query;

      // Get specific user by ID
      if (id) {
        const user = await db
          .collection("users")
          .findOne(
            { _id: new ObjectId(id as string) },
            { projection: { password: 0 } },
          );

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
      }

      // Get all users
      let filter = {};

      // TeamLeads can only see Employee level users they created
      if (currentUser.role === "TeamLead") {
        filter = {
          $or: [{ createdBy: currentUser.email }, { role: "Employee" }],
        };
      }

      const users = await db
        .collection("users")
        .find(filter, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(users);
    }

    // POST /api/users/create - Create new user (Admin function)
    if (req.method === "POST") {
      const { name, email, password, role, position } = req.body;

      if (!name || !email || !password || !role || !position) {
        return res.status(400).json({
          error: "Name, email, password, role, and position are required",
        });
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

      const bcrypt = require("bcryptjs");
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

    // PUT /api/users/:id - Update user (CEO and Admin only)
    if (req.method === "PUT") {
      const { id } = req.query;
      const updates = req.body;

      if (!["CEO", "Admin"].includes(currentUser.role)) {
        return res.status(403).json({
          error: "Only CEO or Admin can update user accounts",
        });
      }

      // Prevent role escalation unless CEO
      if (
        updates.role &&
        updates.role === "Admin" &&
        currentUser.role !== "CEO"
      ) {
        return res.status(403).json({
          error: "Only CEO can promote users to Admin",
        });
      }

      // Remove sensitive fields from updates
      delete updates.password;
      delete updates._id;

      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id as string) },
        {
          $set: {
            ...updates,
            updatedAt: new Date(),
            updatedBy: currentUser.email,
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(id as string) },
          { projection: { password: 0 } },
        );

      return res.status(200).json(updatedUser);
    }

    // DELETE /api/users/:id - Delete user (CEO only)
    if (req.method === "DELETE") {
      const { id } = req.query;

      if (currentUser.role !== "CEO") {
        return res.status(403).json({
          error: "Only CEO can delete user accounts",
        });
      }

      // Prevent CEO from deleting themselves
      if (id === currentUser._id.toString()) {
        return res.status(400).json({
          error: "Cannot delete your own account",
        });
      }

      const result = await db
        .collection("users")
        .deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Users API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
