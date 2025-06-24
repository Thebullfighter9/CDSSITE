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

const now = new Date().toISOString();

const defaultDB: Database = {
  projects: [
    {
      id: "1",
      title: "Neon Runner",
      category: "Action Platformer",
      description:
        "A cyberpunk-inspired platformer with fluid movement and neon aesthetics.",
      status: "In Development",
      tags: [],
      releaseDate: "",
      imageUrl: "",
      demoUrl: "",
      features: [],
      teamMembers: [],
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
    },
    {
      id: "2",
      title: "Circuit Maze",
      category: "Puzzle Game",
      description:
        "Mind-bending puzzles in a digital world where logic meets creativity.",
      status: "Released",
      tags: [],
      releaseDate: "",
      imageUrl: "",
      demoUrl: "",
      features: [],
      teamMembers: [],
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
    },
    {
      id: "3",
      title: "Dream Forge",
      category: "RPG Adventure",
      description:
        "An epic journey through mystical realms with deep character progression.",
      status: "Concept",
      tags: [],
      releaseDate: "",
      imageUrl: "",
      demoUrl: "",
      features: [],
      teamMembers: [],
      createdAt: now,
      updatedAt: now,
      createdBy: "system",
    },
  ],
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
