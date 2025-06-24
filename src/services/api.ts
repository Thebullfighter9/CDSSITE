// API Service Layer for CircuitDreamsStudios
// This simulates MongoDB operations until backend is implemented

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "Concept" | "In Development" | "Released" | "On Hold";
  tags: string[];
  releaseDate: string;
  imageUrl?: string;
  demoUrl?: string;
  features: string[];
  teamMembers: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "Awards" | "Development" | "Company" | "Release";
  author: string;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "New" | "Read" | "Responded" | "Resolved";
}

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: "cds_projects",
  NEWS: "cds_news",
  CONTACTS: "cds_contacts",
} as const;

// Initialize default data
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neon Runner",
    category: "Action Platformer",
    description:
      "A cyberpunk-inspired platformer with fluid movement and neon aesthetics. Experience the thrill of parkour in a digital world where every surface pulses with electric energy.",
    status: "In Development",
    tags: ["Unity", "C#", "Cyberpunk", "Platformer", "Parkour"],
    releaseDate: "2024-Q2",
    features: [
      "Fluid parkour movement system",
      "Dynamic neon lighting effects",
      "Procedurally generated levels",
      "Electronic soundtrack integration",
      "Customizable character abilities",
    ],
    teamMembers: ["Alex Chen", "Maya Rodriguez", "Jordan Kim"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "admin@circuitdreamsstudios.com",
  },
  {
    id: "2",
    title: "Circuit Maze",
    category: "Puzzle Game",
    description:
      "Mind-bending puzzles in a digital world where logic meets creativity. Navigate through intricate circuit patterns and unlock the secrets of the digital realm.",
    status: "Released",
    tags: ["Unreal", "Blueprint", "Puzzle", "Logic", "VR Compatible"],
    releaseDate: "2023-11-15",
    features: [
      "100+ unique puzzle levels",
      "VR and desktop compatibility",
      "Advanced circuit simulation",
      "Educational mode for learning",
      "Level editor and sharing",
    ],
    teamMembers: ["Maya Rodriguez", "Sam Wilson", "Jordan Kim"],
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-11-15T14:00:00Z",
    createdBy: "admin@circuitdreamsstudios.com",
  },
  {
    id: "3",
    title: "Dream Forge",
    category: "RPG Adventure",
    description:
      "An epic journey through mystical realms with deep character progression. Craft your destiny in a world where dreams shape reality and magic flows through ancient technologies.",
    status: "Concept",
    tags: ["Unity", "RPG", "Fantasy", "Adventure", "Open World"],
    releaseDate: "2025-Q1",
    features: [
      "Vast open world exploration",
      "Deep character customization",
      "Branching narrative system",
      "Crafting and base building",
      "Multiplayer co-op campaign",
    ],
    teamMembers: ["Alex Chen", "Maya Rodriguez", "Jordan Kim", "Sam Wilson"],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-20T16:45:00Z",
    createdBy: "admin@circuitdreamsstudios.com",
  },
];

const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Circuit Maze Wins Indie Game Award",
    excerpt:
      "Our latest puzzle game has been recognized for innovation in game design at the Indie Excellence Awards 2024.",
    content: `We're thrilled to announce that Circuit Maze has won the Excellence in Game Design award at the prestigious Indie Excellence Awards 2024. This recognition validates our team's hard work and innovative approach to puzzle gaming.

The award committee praised Circuit Maze for its unique blend of educational content and engaging gameplay, as well as its groundbreaking VR implementation that makes circuit logic accessible to players of all ages.

"This award belongs to our entire team," said Alex Chen, Lead Developer. "From Maya's incredible UI design to Jordan's immersive audio landscapes, every team member contributed to making Circuit Maze something special."

The game has now reached over 100,000 players worldwide and continues to grow in popularity among both gaming enthusiasts and educational institutions.`,
    date: "2024-01-15",
    category: "Awards",
    author: "CircuitDreamsStudios Team",
    published: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Development Update: Neon Runner Progress",
    excerpt:
      "Take a behind-the-scenes look at our upcoming cyberpunk platformer and see how the neon-soaked world is coming to life.",
    content: `Development on Neon Runner has been progressing at lightning speed (pun intended)! Our team has been working tirelessly to bring this cyberpunk platformer to life, and we're excited to share some updates.

**Technical Achievements:**
- Completed the core parkour movement system with 60fps fluid animations
- Implemented dynamic lighting system that responds to player movement
- Created procedural level generation for endless replayability

**Visual Progress:**
- Finalized the neon art style with over 200 unique visual effects
- Developed character customization system with 50+ cosmetic options
- Created 15 distinct environments ranging from towering data spires to underground server farms

**What's Next:**
We're currently in alpha testing phase with our internal team. Beta testing will begin in March 2024, followed by the full release in Q2 2024.

Stay tuned for more updates and get ready to run through the digital realm!`,
    date: "2024-01-10",
    category: "Development",
    author: "Alex Chen",
    published: true,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    title: "Team Expansion: Welcome New Developers",
    excerpt:
      "We're excited to welcome three talented developers to our growing CircuitDreamsStudios family.",
    content: `CircuitDreamsStudios is growing! We're thrilled to announce that three exceptional developers have joined our team, bringing fresh perspectives and incredible talent to our studio.

**Meet Our New Team Members:**

**Sarah Chen - Senior 3D Artist**
Sarah brings 8 years of experience from AAA studios, having worked on titles like "Cosmic Legends" and "Mech Warriors Online." She'll be leading our 3D art direction for Dream Forge.

**Marcus Rodriguez - Gameplay Programmer**
A specialist in AI and procedural generation, Marcus will be instrumental in bringing intelligent NPCs and dynamic world systems to our upcoming projects.

**Elena Kowalski - Audio Director**
Elena's background in both music composition and technical audio implementation makes her the perfect addition to our audio team. She'll be working closely with Jordan on our upcoming releases.

With our team now at 15 talented individuals, we're better positioned than ever to create the immersive experiences our players deserve. Welcome to the team!`,
    date: "2024-01-05",
    category: "Company",
    author: "Maya Rodriguez",
    published: true,
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-05T09:00:00Z",
  },
];

// API Functions
class ApiService {
  // Projects API
  static async getProjects(): Promise<Project[]> {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(
      STORAGE_KEYS.PROJECTS,
      JSON.stringify(DEFAULT_PROJECTS),
    );
    return DEFAULT_PROJECTS;
  }

  static async getProject(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  static async createProject(
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project> {
    const projects = await this.getProjects();
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  }

  static async updateProject(
    id: string,
    updates: Partial<Project>,
  ): Promise<Project | null> {
    const projects = await this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[index];
  }

  static async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) return false;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return true;
  }

  // News API
  static async getNews(): Promise<NewsArticle[]> {
    const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
    return DEFAULT_NEWS;
  }

  static async getNewsArticle(id: string): Promise<NewsArticle | null> {
    const news = await this.getNews();
    return news.find((n) => n.id === id) || null;
  }

  static async createNews(
    newsData: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">,
  ): Promise<NewsArticle> {
    const news = await this.getNews();
    const newArticle: NewsArticle = {
      ...newsData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    news.unshift(newArticle); // Add to beginning for chronological order
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    return newArticle;
  }

  static async updateNews(
    id: string,
    updates: Partial<NewsArticle>,
  ): Promise<NewsArticle | null> {
    const news = await this.getNews();
    const index = news.findIndex((n) => n.id === id);
    if (index === -1) return null;

    news[index] = {
      ...news[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    return news[index];
  }

  static async deleteNews(id: string): Promise<boolean> {
    const news = await this.getNews();
    const filtered = news.filter((n) => n.id !== id);
    if (filtered.length === news.length) return false;
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(filtered));
    return true;
  }

  // Contact API
  static async getContacts(): Promise<ContactSubmission[]> {
    const stored = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return stored ? JSON.parse(stored) : [];
  }

  static async submitContact(
    contactData: Omit<ContactSubmission, "id" | "submittedAt" | "status">,
  ): Promise<ContactSubmission> {
    const contacts = await this.getContacts();
    const newContact: ContactSubmission = {
      ...contactData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: "New",
    };
    contacts.unshift(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return newContact;
  }

  static async updateContactStatus(
    id: string,
    status: ContactSubmission["status"],
  ): Promise<boolean> {
    const contacts = await this.getContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;

    contacts[index].status = status;
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return true;
  }
}

export default ApiService;
