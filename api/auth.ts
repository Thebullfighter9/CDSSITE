import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const CEO_EMAIL = process.env.CEO_EMAIL as string;
const CEO_PASSWORD = process.env.CEO_PASSWORD as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  if (email === CEO_EMAIL && password === CEO_PASSWORD) {
    const token = jwt.sign({ email, role: "CEO" }, JWT_SECRET, { expiresIn: "8h" });
    return res.status(200).json({ token, role: "CEO" });
  }

  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  res.status(200).json({ token, role: user.role });
}
