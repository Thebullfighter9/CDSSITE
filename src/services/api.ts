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

export interface SiteStats {
  gamesDeveloped: string;
  teamMembers: string;
  yearsExperience: string;
  hoursThisWeek: string;
  tasksCompleted: string;
  teamRating: string;
}

const BASE = "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("cds_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    ...options,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("cds_token");
      localStorage.removeItem("cds_user");
      window.location.href = "/employee-portal";
      throw new Error("Authentication required");
    }
    throw new Error(res.statusText);
  }
  return res.json() as Promise<T>;
}

class ApiService {
  // Authentication
  static async login(email: string, password: string) {
    return request<{ token: string; user: any }>(
      `${BASE}/api/auth?action=login`,
      {
        method: "POST",
        body: { email, password },
      },
    );
  }

  static async getCurrentUser() {
    return request<any>(`${BASE}/api/auth?action=me`);
  }

  static async setupCEO() {
    return request<{ message: string }>(`${BASE}/api/auth?action=setup-ceo`, {
      method: "POST",
    });
  }

  static async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    position: string;
  }) {
    return request<any>(`${BASE}/api/auth?action=register`, {
      method: "POST",
      body: userData,
    });
  }

  // Users
  static getUsers() {
    return request<any[]>(`${BASE}/api/users`);
  }

  static createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    position: string;
  }) {
    return request<any>(`${BASE}/api/users`, {
      method: "POST",
      body: userData,
    });
  }

  static updateUser(id: string, updates: any) {
    return request<any>(`${BASE}/api/users?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteUser(id: string) {
    return request<{ message: string }>(`${BASE}/api/users?id=${id}`, {
      method: "DELETE",
    });
  }

  // Projects
  static getProjects() {
    return request<Project[]>(`${BASE}/api/projects`);
  }

  static getProject(id: string) {
    return request<Project | null>(`${BASE}/api/projects?id=${id}`);
  }

  static createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
    return request<Project>(`${BASE}/api/projects`, {
      method: "POST",
      body: data,
    });
  }

  static updateProject(id: string, updates: Partial<Project>) {
    return request<Project>(`${BASE}/api/projects?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteProject(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/projects?id=${id}`, {
      method: "DELETE",
    });
  }

  // News
  static getNews() {
    return request<NewsArticle[]>(`${BASE}/api/news`);
  }

  static getNewsArticle(id: string) {
    return request<NewsArticle | null>(`${BASE}/api/news?id=${id}`);
  }

  static createNews(data: Omit<NewsArticle, "id" | "createdAt" | "updatedAt">) {
    return request<NewsArticle>(`${BASE}/api/news`, {
      method: "POST",
      body: data,
    });
  }

  static updateNews(id: string, updates: Partial<NewsArticle>) {
    return request<NewsArticle>(`${BASE}/api/news?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteNews(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/news?id=${id}`, {
      method: "DELETE",
    });
  }

  // Contacts
  static getContacts() {
    return request<ContactSubmission[]>(`${BASE}/api/contacts`);
  }

  static submitContact(
    data: Omit<ContactSubmission, "id" | "submittedAt" | "status">,
  ) {
    return request<ContactSubmission>(`${BASE}/api/contacts`, {
      method: "POST",
      body: data,
    });
  }

  static updateContactStatus(id: string, status: ContactSubmission["status"]) {
    return request<ContactSubmission>(`${BASE}/api/contacts?id=${id}`, {
      method: "PUT",
      body: { status },
    });
  }

  // Stats
  static getStats() {
    return request<SiteStats>(`${BASE}/api/stats`);
  }

  static updateStats(data: Partial<SiteStats>) {
    return request<SiteStats>(`${BASE}/api/stats`, {
      method: "PUT",
      body: data,
    });
  }

  // Employees
  static getEmployees() {
    return request<any[]>(`${BASE}/api/employees`);
  }

  static addEmployee(data: any) {
    return request<any>(`${BASE}/api/employees`, {
      method: "POST",
      body: data,
    });
  }

  static updateEmployee(id: string, updates: any) {
    return request<any>(`${BASE}/api/employees?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteEmployee(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/employees?id=${id}`, {
      method: "DELETE",
    });
  }

  // Timesheets
  static getTimesheets() {
    return request<any[]>(`${BASE}/api/timesheets`);
  }

  static addTimesheet(data: any) {
    return request<any>(`${BASE}/api/timesheets`, {
      method: "POST",
      body: data,
    });
  }

  static updateTimesheet(id: string, updates: any) {
    return request<any>(`${BASE}/api/timesheets?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteTimesheet(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/timesheets?id=${id}`, {
      method: "DELETE",
    });
  }

  // Tasks
  static getTasks() {
    return request<any[]>(`${BASE}/api/tasks`);
  }

  static addTask(data: any) {
    return request<any>(`${BASE}/api/tasks`, { method: "POST", body: data });
  }

  static updateTask(id: string, updates: any) {
    return request<any>(`${BASE}/api/tasks?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteTask(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/tasks?id=${id}`, {
      method: "DELETE",
    });
  }

  // Calendar
  static getCalendar() {
    return request<any[]>(`${BASE}/api/calendar`);
  }

  static addEvent(data: any) {
    return request<any>(`${BASE}/api/calendar`, { method: "POST", body: data });
  }

  static updateEvent(id: string, updates: any) {
    return request<any>(`${BASE}/api/calendar?id=${id}`, {
      method: "PUT",
      body: updates,
    });
  }

  static deleteEvent(id: string) {
    return request<{ deleted: boolean }>(`${BASE}/api/calendar?id=${id}`, {
      method: "DELETE",
    });
  }

  // Files
  static listFiles() {
    return request<string[]>(`${BASE}/api/files`);
  }
}

export default ApiService;
