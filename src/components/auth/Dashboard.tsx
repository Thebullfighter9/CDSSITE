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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

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

const recentActivity = [
  {
    action: "Completed task",
    target: "UI Design for Neon Runner",
    time: "2 hours ago",
    type: "task",
  },
  {
    action: "Started sprint",
    target: "Circuit Maze v2.0",
    time: "1 day ago",
    type: "sprint",
  },
  {
    action: "Meeting attended",
    target: "Weekly Team Standup",
    time: "2 days ago",
    type: "meeting",
  },
  {
    action: "Code review",
    target: "Player Movement System",
    time: "3 days ago",
    type: "review",
  },
];

const projectProgress = [
  { name: "Neon Runner", progress: 75, status: "In Progress" },
  { name: "Circuit Maze Update", progress: 45, status: "Development" },
  { name: "Dream Forge Concept", progress: 20, status: "Planning" },
];

export function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

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
                <p className="text-xs text-foreground/60">
                  {user.role} • {user.department}
                </p>
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
                  {projectProgress.map((project, index) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{project.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="text-xs border-neon-cyan/30 text-neon-cyan/80"
                          >
                            {project.status}
                          </Badge>
                          <span className="text-sm text-foreground/70">
                            {project.progress}%
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={project.progress}
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
                  { label: "Hours This Week", value: "32", icon: Clock },
                  { label: "Tasks Completed", value: "18", icon: CheckCircle },
                  { label: "Team Rating", value: "4.8", icon: Star },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
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
                    {recentActivity.map((activity, index) => (
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
