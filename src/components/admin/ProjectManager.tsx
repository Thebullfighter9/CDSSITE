import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Tag,
  Users,
  Image,
  Link,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ApiService, { Project } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const PROJECT_STATUSES = [
  "Concept",
  "In Development",
  "Released",
  "On Hold",
] as const;
const PROJECT_CATEGORIES = [
  "Action Platformer",
  "Puzzle Game",
  "RPG Adventure",
  "Strategy Game",
  "Racing Game",
  "Simulation",
  "Educational",
  "VR Experience",
] as const;

interface ProjectFormData {
  title: string;
  category: string;
  description: string;
  status: (typeof PROJECT_STATUSES)[number];
  tags: string[];
  releaseDate: string;
  features: string[];
  teamMembers: string[];
  imageUrl: string;
  demoUrl: string;
}

const initialFormData: ProjectFormData = {
  title: "",
  category: "",
  description: "",
  status: "Concept",
  tags: [],
  releaseDate: "",
  features: [],
  teamMembers: [],
  imageUrl: "",
  demoUrl: "",
};

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [newTag, setNewTag] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await ApiService.getProjects();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingProject) {
        await ApiService.updateProject(editingProject.id, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await ApiService.createProject({
          ...formData,
          createdBy: user.email,
        });
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      await loadProjects();
      handleCloseForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      status: project.status,
      tags: project.tags,
      releaseDate: project.releaseDate,
      features: project.features,
      teamMembers: project.teamMembers,
      imageUrl: project.imageUrl || "",
      demoUrl: project.demoUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await ApiService.deleteProject(id);
      await loadProjects();
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormData(initialFormData);
    setNewTag("");
    setNewFeature("");
    setNewTeamMember("");
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTeamMember = () => {
    if (
      newTeamMember.trim() &&
      !formData.teamMembers.includes(newTeamMember.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember.trim()],
      }));
      setNewTeamMember("");
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m !== member),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neon-cyan">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-cyan">
          Project Management
        </h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <Card className="bg-card/40 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-neon-blue">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-foreground/70">
                        {project.category}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${
                        project.status === "Released"
                          ? "bg-green-500/20 text-green-400"
                          : project.status === "In Development"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : project.status === "On Hold"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-foreground/60">
                      <Calendar className="mr-1 h-3 w-3" />
                      {project.releaseDate}
                    </div>
                    <div className="flex items-center text-xs text-foreground/60">
                      <Users className="mr-1 h-3 w-3" />
                      {project.teamMembers.length} team members
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-neon-cyan/30 text-neon-cyan/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(project)}
                      className="flex-1 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(project.id)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && handleCloseForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-card/95 glass border-neon-cyan/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-neon-cyan">
                      {editingProject ? "Edit Project" : "Create New Project"}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseForm}
                      className="text-foreground/70 hover:text-neon-cyan"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-neon-cyan">
                            Project Title *
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category" className="text-neon-cyan">
                            Category *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-background/50 border-neon-cyan/30">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROJECT_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="status" className="text-neon-cyan">
                            Status *
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: any) =>
                              setFormData((prev) => ({
                                ...prev,
                                status: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-background/50 border-neon-cyan/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PROJECT_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="releaseDate"
                            className="text-neon-cyan"
                          >
                            Release Date
                          </Label>
                          <Input
                            id="releaseDate"
                            value={formData.releaseDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                releaseDate: e.target.value,
                              }))
                            }
                            placeholder="e.g., 2024-Q2, March 2024"
                            className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          />
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="imageUrl" className="text-neon-cyan">
                            Image URL
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-background/30 border border-r-0 border-neon-cyan/30 rounded-l-md">
                              <Image className="h-4 w-4 text-foreground/50" />
                            </div>
                            <Input
                              id="imageUrl"
                              value={formData.imageUrl}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  imageUrl: e.target.value,
                                }))
                              }
                              placeholder="https://..."
                              className="rounded-l-none bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="demoUrl" className="text-neon-cyan">
                            Demo URL
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-3 bg-background/30 border border-r-0 border-neon-cyan/30 rounded-l-md">
                              <Link className="h-4 w-4 text-foreground/50" />
                            </div>
                            <Input
                              id="demoUrl"
                              value={formData.demoUrl}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  demoUrl: e.target.value,
                                }))
                              }
                              placeholder="https://..."
                              className="rounded-l-none bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description" className="text-neon-cyan">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                        required
                      />
                    </div>

                    <Separator className="bg-neon-cyan/20" />

                    {/* Tags */}
                    <div>
                      <Label className="text-neon-cyan">Tags</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          className="flex-1 bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="bg-neon-purple text-black hover:bg-neon-cyan"
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-neon-cyan/20 text-neon-cyan cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <Label className="text-neon-cyan">Features</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Add a feature..."
                          className="flex-1 bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addFeature())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addFeature}
                          className="bg-neon-blue text-black hover:bg-neon-cyan"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-background/30 rounded border border-neon-blue/20"
                          >
                            <CheckCircle className="h-3 w-3 text-neon-blue" />
                            <span className="flex-1 text-sm">{feature}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFeature(index)}
                              className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Members */}
                    <div>
                      <Label className="text-neon-cyan">Team Members</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newTeamMember}
                          onChange={(e) => setNewTeamMember(e.target.value)}
                          placeholder="Add team member..."
                          className="flex-1 bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addTeamMember())
                          }
                        />
                        <Button
                          type="button"
                          onClick={addTeamMember}
                          className="bg-neon-purple text-black hover:bg-neon-cyan"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.teamMembers.map((member) => (
                          <Badge
                            key={member}
                            className="bg-neon-purple/20 text-neon-purple cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                            onClick={() => removeTeamMember(member)}
                          >
                            {member} ×
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-neon-cyan/20" />

                    {/* Form Actions */}
                    <div className="flex gap-4 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseForm}
                        className="border-foreground/30 text-foreground/70 hover:bg-foreground/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {editingProject ? "Update Project" : "Create Project"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
