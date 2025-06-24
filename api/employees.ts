import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    if (req.query.id) {
      const emp = db.employees.find((e) => e.id === req.query.id);
      return res.status(200).json(emp || null);
    }
    return res.status(200).json(db.employees);
  }

  if (method === "POST") {
    const emp = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    db.employees.push(emp);
    await writeDB(db);
    return res.status(201).json(emp);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.employees.findIndex((e) => e.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.employees[index] = { ...db.employees[index], ...req.body };
    await writeDB(db);
    return res.status(200).json(db.employees[index]);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    const initial = db.employees.length;
    db.employees = db.employees.filter((e) => e.id !== id);
    await writeDB(db);
    return res.status(200).json({ deleted: initial !== db.employees.length });
  }

  res.status(405).end();
}
