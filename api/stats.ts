import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    return res.status(200).json(db.stats);
  }

  if (method === "PUT") {
    db.stats = { ...db.stats, ...req.body };
    await writeDB(db);
    return res.status(200).json(db.stats);
  }

  res.status(405).end();
}
