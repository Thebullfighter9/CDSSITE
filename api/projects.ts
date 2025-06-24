import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const project = db.projects.find((p) => p.id === req.query.id);
      return res.status(200).json(project || null);
    }
    return res.status(200).json(db.projects);
  }

  if (method === "POST") {
    const project = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.projects.push(project);
    await writeDB(db);
    return res.status(201).json(project);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.projects.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.projects[index] = {
      ...db.projects[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeDB(db);
    return res.status(200).json(db.projects[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.projects.length });
  }

  res.status(405).end();
}
