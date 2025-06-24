import { VercelRequest, VercelResponse } from "@vercel/node";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join("/tmp", "uploads");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  if (method === "GET") {
    const files = await fs.readdir(UPLOAD_DIR);
    return res.status(200).json(files);
  }

  res.status(405).end();
}
