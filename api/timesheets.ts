import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const ts = db.timesheets.find((t) => t.id === req.query.id);
      return res.status(200).json(ts || null);
    }
    return res.status(200).json(db.timesheets);
  }

  if (method === "POST") {
    const entry = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    db.timesheets.push(entry);
    await writeDB(db);
    return res.status(201).json(entry);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.timesheets.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.timesheets[index] = { ...db.timesheets[index], ...req.body };
    await writeDB(db);
    return res.status(200).json(db.timesheets[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.timesheets.length;
    db.timesheets = db.timesheets.filter((t) => t.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.timesheets.length });
  }

  res.status(405).end();
}
