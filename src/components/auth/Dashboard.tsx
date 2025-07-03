import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Clock,
  Calendar,
  Users,
  FileText,
  Settings,
  Activity,
  TrendingUp,
  Star,
  CheckCircle,
  Shield,
  Gamepad2,
  Newspaper,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { ContactManager } from "@/components/admin/ContactManager";
import { StatsManager } from "@/components/admin/StatsManager";
import { TimesheetManager } from "@/components/admin/TimesheetManager";
import { TeamCalendar } from "@/components/admin/TeamCalendar";
import ApiService, { SiteStats, Project } from "@/services/api";

const dashboardCards = [
  {
    title: "Time Tracking",
    icon: Clock,
    description: "Log and track your working hours",
    color: "neon-cyan",
    action: "Open Timesheet",
  },
  {
    title: "Project Tasks",
    icon: CheckCircle,
    description: "View and manage your assigned tasks",
    color: "neon-blue",
    action: "View Tasks",
  },
  {
    title: "Team Calendar",
    icon: Calendar,
    description: "Check team meetings and deadlines",
    color: "neon-purple",
    action: "Open Calendar",
  },
  {
    title: "Documents",
    icon: FileText,
    description: "Access company docs and resources",
    color: "neon-cyan",
    action: "Browse Files",
  },
];

const adminCards = [
  {
    title: "Project Management",
    icon: Gamepad2,
    description: "Manage game projects and featured content",
    color: "neon-cyan",
    action: "Manage Projects",
    tab: "projects",
  },
  {
    title: "News Management",
    icon: Newspaper,
    description: "Create and manage news articles",
    color: "neon-blue",
    action: "Manage News",
    tab: "news",
  },
  {
    title: "Contact Management",
    icon: Mail,
    description: "View and respond to contact submissions",
    color: "neon-purple",
    action: "Manage Contacts",
    tab: "contacts",
  },
  {
    title: "Timesheets",
    icon: Clock,
    description: "Manage employee hours",
    color: "neon-cyan",
    action: "Manage Timesheets",
    tab: "timesheets",
  },
  {
    title: "Team Calendar",
    icon: Calendar,
    description: "Manage meetings and deadlines",
    color: "neon-blue",
    action: "Manage Calendar",
    tab: "calendar",
  },
  {
    title: "Settings",
    icon: Settings,
    description: "Configure system settings",
    color: "neon-cyan",
    action: "Open Settings",
    tab: "settings",
  },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getStats().then(setStats);
    ApiService.getProjects().then(setProjects);
  }, []);

  const getProgress = (status: Project["status"]): number => {
    switch (status) {
      case "Released":
        return 100;
      case "In Development":
        return 50;
      case "Concept":
        return 10;
      case "On Hold":
        return 25;
      default:
        return 0;
    }
  };

  if (!user) return null;

  const isAdmin = user.isAdmin || ["CEO", "Admin"].includes(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-circuit-darker">
      {/* Header */}
      <div className="border-b border-neon-cyan/20 bg-card/30 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Employee Dashboard
              </h1>
              <p className="text-foreground/70">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-neon-cyan">
                  {user.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-foreground/60">
                    {user.role} • {user.position}
                  </p>
                  {isAdmin && (
                    <Badge className="text-xs bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-xl font-semibold text-neon-cyan mb-6">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardCards.map((card, index) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="bg-card/40 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 group cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-3">
                                  <card.icon
                                    className={`h-6 w-6 text-${card.color} group-hover:animate-neon-glow transition-all duration-300`}
                                  />
                                  <h3 className="text-lg font-semibold ml-2">
                                    {card.title}
                                  </h3>
                                </div>
                                <p className="text-foreground/70 text-sm mb-4">
                                  {card.description}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={`border-${card.color} text-${card.color} hover:bg-${card.color} hover:text-black transition-all duration-300`}
                                >
                                  {card.action}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Admin Section */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h2 className="text-xl font-semibold text-neon-purple mb-6 flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Admin Controls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {adminCards.map((card, index) => (
                        <motion.div
                          key={card.title}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.1,
                          }}
                        >
                          <Card
                            className="bg-card/40 glass border-neon-purple/20 hover:border-neon-purple/40 transition-all duration-300 group cursor-pointer"
                            onClick={() => card.tab && setActiveTab(card.tab)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-3">
                                    <card.icon
                                      className={`h-6 w-6 text-${card.color} group-hover:animate-neon-glow transition-all duration-300`}
                                    />
                                    <h3 className="text-lg font-semibold ml-2">
                                      {card.title}
                                    </h3>
                                  </div>
                                  <p className="text-foreground/70 text-sm mb-4">
                                    {card.description}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={`border-${card.color} text-${card.color} hover:bg-${card.color} hover:text-black transition-all duration-300`}
                                  >
                                    {card.action}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Project Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-neon-cyan mb-6">
                    Current Projects
                  </h2>
                  <Card className="bg-card/40 glass border-neon-blue/20">
                    <CardHeader>
                      <CardTitle className="text-neon-blue">
                        Project Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + index * 0.1,
                          }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{project.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-neon-cyan/30 text-neon-cyan/80"
                              >
                                {project.status}
                              </Badge>
                              <span className="text-sm text-foreground/70">
                                {getProgress(project.status)}%
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={getProgress(project.status)}
                            className="h-2 bg-circuit-dark"
                          />
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-neon-cyan mb-6">
                    Your Stats
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Hours This Week",
                        value: stats?.hoursThisWeek || "-",
                        icon: Clock,
                      },
                      {
                        label: "Tasks Completed",
                        value: stats?.tasksCompleted || "-",
                        icon: CheckCircle,
                      },
                      {
                        label: "Team Rating",
                        value: stats?.teamRating || "-",
                        icon: Star,
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.4 + index * 0.1,
                        }}
                      >
                        <Card className="bg-card/40 glass border-neon-purple/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-foreground/70">
                                  {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-neon-purple">
                                  {stat.value}
                                </p>
                              </div>
                              <stat.icon className="h-8 w-8 text-neon-purple/60" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-xl font-semibold text-neon-cyan mb-6">
                    Recent Activity
                  </h2>
                  <Card className="bg-card/40 glass border-neon-cyan/20">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {recentActivity.length === 0 ? (
                          <p className="text-sm text-foreground/60">
                            No activity yet.
                          </p>
                        ) : (
                          recentActivity.map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: 0.6 + index * 0.1,
                              }}
                              className="flex items-start space-x-3 pb-3 border-b border-neon-cyan/10 last:border-b-0 last:pb-0"
                            >
                              <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                  <span className="font-medium text-neon-cyan">
                                    {activity.action}
                                  </span>{" "}
                                  <span className="text-foreground/80">
                                    {activity.target}
                                  </span>
                                </p>
                                <p className="text-xs text-foreground/60 mt-1">
                                  {activity.time}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Admin Tabs */}
          {isAdmin && (
            <>
              <TabsContent value="projects">
                <ProjectManager />
              </TabsContent>

              <TabsContent value="news">
                <NewsManager />
              </TabsContent>

              <TabsContent value="contacts">
                <ContactManager />
              </TabsContent>

              <TabsContent value="timesheets">
                <TimesheetManager />
              </TabsContent>

              <TabsContent value="calendar">
                <TeamCalendar />
              </TabsContent>

              <TabsContent value="settings">
                <StatsManager />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
