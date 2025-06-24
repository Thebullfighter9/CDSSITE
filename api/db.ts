import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join("/tmp", "cds-db.json");

interface Database {
  projects: any[];
  news: any[];
  contacts: any[];
  stats: any;
  employees: any[];
  timesheets: any[];
  tasks: any[];
  calendar: any[];
}

const defaultDB: Database = {
  projects: [],
  news: [],
  contacts: [],
  stats: {
    gamesDeveloped: "0",
    teamMembers: "0",
    yearsExperience: "0",
    hoursThisWeek: "0",
    tasksCompleted: "0",
    teamRating: "0",
  },
  employees: [],
  timesheets: [],
  tasks: [],
  calendar: [],
};

export async function readDB(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data) as Database;
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDB, null, 2), "utf-8");
    return { ...defaultDB };
  }
}

export async function writeDB(data: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
