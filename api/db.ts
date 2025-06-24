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
  employees: [
    {
      id: "1",
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      department: "Engineering",
      email: "alex@cds.com",
      specialties: [
        "Game Engine Development",
        "AI Programming",
        "System Architecture",
      ],
      icon: "Code",
      color: "neon-cyan",
      createdAt: now,
    },
    {
      id: "2",
      name: "Maya Rodriguez",
      role: "Creative Director",
      department: "Design",
      email: "maya@cds.com",
      specialties: ["Game Design", "UI/UX", "Art Direction"],
      icon: "Palette",
      color: "neon-blue",
      createdAt: now,
    },
    {
      id: "3",
      name: "Jordan Kim",
      role: "Audio Director",
      department: "Audio",
      email: "jordan@cds.com",
      specialties: [
        "Sound Design",
        "Music Composition",
        "Audio Programming",
      ],
      icon: "Music",
      color: "neon-purple",
      createdAt: now,
    },
    {
      id: "4",
      name: "Sam Wilson",
      role: "Technical Lead",
      department: "Engineering",
      email: "sam@cds.com",
      specialties: [
        "Backend Systems",
        "DevOps",
        "Performance Optimization",
      ],
      icon: "Rocket",
      color: "neon-cyan",
      createdAt: now,
    },
  ],
  timesheets: [
    {
      id: "1",
      employeeId: "1",
      date: now.split("T")[0],
      clockIn: "09:00",
      clockOut: "17:00",
      createdAt: now,
    },
  ],
  tasks: [],
  calendar: [
    {
      id: "1",
      title: "Weekly Sync",
      date: now.split("T")[0],
      description: "Team standup meeting",
      createdAt: now,
    },
    {
      id: "2",
      title: "Release Deadline",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      description: "Version 1.0 release",
      createdAt: now,
    },
  ],
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
