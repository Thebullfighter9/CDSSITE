import { VercelRequest, VercelResponse } from "@vercel/node";
import { readDB, writeDB } from "./db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await readDB();
  const { method } = req;

  if (method === "GET") {
    return res.status(200).json(db.contacts);
  }

  if (method === "POST") {
    const submission = {
      ...req.body,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "New",
    };
    db.contacts.unshift(submission);
    await writeDB(db);
    return res.status(201).json(submission);
  }

  if (method === "PUT") {
    const { id } = req.query;
    const index = db.contacts.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db.contacts[index] = { ...db.contacts[index], ...req.body };
    await writeDB(db);
    return res.status(200).json(db.contacts[index]);
  }

  res.status(405).end();
}
