import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const article = db.news.find((n) => n.id === req.query.id);
      return res.status(200).json(article || null);
    }
    return res.status(200).json(db.news);
  }

  if (method === "POST") {
    const article = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.news.unshift(article);
    await writeDB(db);
    return res.status(201).json(article);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.news.findIndex((n) => n.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.news[index] = {
      ...db.news[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeDB(db);
    return res.status(200).json(db.news[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.news.length;
    db.news = db.news.filter((n) => n.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.news.length });
  }

  res.status(405).end();
}
