import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const t = db.tasks.find((task) => task.id === req.query.id);
      return res.status(200).json(t || null);
    }
    return res.status(200).json(db.tasks);
  }

  if (method === "POST") {
    const t = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    db.tasks.push(t);
    await writeDB(db);
    return res.status(201).json(t);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.tasks.findIndex((task) => task.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    await writeDB(db);
    return res.status(200).json(db.tasks[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.tasks.length;
    db.tasks = db.tasks.filter((task) => task.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.tasks.length });
  }

  res.status(405).end();
}
