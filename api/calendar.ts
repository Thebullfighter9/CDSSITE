import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const ev = db.calendar.find((e) => e.id === req.query.id);
      return res.status(200).json(ev || null);
    }
    return res.status(200).json(db.calendar);
  }

  if (method === "POST") {
    const ev = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    db.calendar.push(ev);
    await writeDB(db);
    return res.status(201).json(ev);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.calendar.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.calendar[index] = { ...db.calendar[index], ...req.body };
    await writeDB(db);
    return res.status(200).json(db.calendar[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.calendar.length;
    db.calendar = db.calendar.filter((e) => e.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.calendar.length });
  }

  res.status(405).end();
}
