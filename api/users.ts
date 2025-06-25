import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./mongo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload { id?: string; role: string; email?: string }

function verify(req: VercelRequest): TokenPayload | null {
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
  const payload = verify(req);
  if (!payload) return res.status(401).end();

  if (req.method === "POST") {
    if (payload.role !== "CEO") return res.status(403).end();
    const { email, password, role } = req.body as { email: string; password: string; role: string };
    if (!email || !password || !role) return res.status(400).end();

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email });
    if (existing) return res.status(400).json({ error: "User exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, passwordHash, role, createdAt: new Date().toISOString() };
    const result = await db.collection("users").insertOne(user);
    return res.status(201).json({ id: result.insertedId, email, role });
  }

  if (req.method === "GET") {
    const db = await getDb();
    const users = await db.collection("users")
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();
    return res.status(200).json(users);
  }

  res.status(405).end();
}
