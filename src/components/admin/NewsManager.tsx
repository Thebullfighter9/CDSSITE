import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Eye,
  EyeOff,
  FileText,
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ApiService, { NewsArticle } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const NEWS_CATEGORIES = [
  "Awards",
  "Development",
  "Company",
  "Release",
] as const;

interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  category: (typeof NEWS_CATEGORIES)[number];
  author: string;
  imageUrl: string;
  published: boolean;
}

const initialFormData: NewsFormData = {
  title: "",
  excerpt: "",
  content: "",
  category: "Development",
  author: "",
  imageUrl: "",
  published: false,
};

export function NewsManager() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await ApiService.getNews();
      setNews(data);
    } catch (error) {
      // Use fallback data in development
      console.warn("API failed, using fallback news data");
      setNews([
        {
          id: "1",
          title: "Circuit Dreams Alpha Reaches Major Milestone",
          excerpt:
            "Our flagship game has completed its core mechanics and is moving into the polishing phase.",
          content:
            "We're excited to announce that Circuit Dreams Alpha has reached a major development milestone. The core gameplay mechanics, character progression system, and main story arc are now complete. Our team is moving into the polishing phase, focusing on performance optimization, bug fixes, and visual enhancements. We expect to enter beta testing within the next two months.",
          date: new Date().toISOString(),
          category: "Development",
          author: "Alex Dowling",
          imageUrl: "",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "CircuitDreamsStudios Wins Indie Game Excellence Award",
          excerpt:
            "We're honored to receive recognition for our innovative approach to cyberpunk storytelling.",
          content:
            "CircuitDreamsStudios has been awarded the Indie Game Excellence Award for Innovation in Storytelling at the Independent Game Developers Conference. This recognition highlights our team's dedication to creating immersive, narrative-driven experiences that push the boundaries of interactive entertainment.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          category: "Awards",
          author: "Maya Rodriguez",
          imageUrl: "",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "New Team Member: Jordan Kim Joins as Lead Designer",
          excerpt:
            "We're thrilled to welcome Jordan Kim to our growing team of creative professionals.",
          content:
            "CircuitDreamsStudios is excited to announce the addition of Jordan Kim as our new Lead Designer. Jordan brings over 8 years of experience in game design and has worked on several acclaimed indie titles. With Jordan's expertise, we're confident in our ability to deliver even more compelling and polished gaming experiences.",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
          category: "Company",
          author: "Alex Dowling",
          imageUrl: "",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingNews) {
        await ApiService.updateNews(editingNews.id, {
          ...formData,
          date: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: "News article updated successfully",
        });
      } else {
        await ApiService.createNews({
          ...formData,
          date: new Date().toISOString().split("T")[0],
          author: formData.author || user.name,
        });
        toast({
          title: "Success",
          description: "News article created successfully",
        });
      }
      await loadNews();
      handleCloseForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save news article",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl || "",
      published: article.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      await ApiService.deleteNews(id);
      await loadNews();
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingNews(null);
    setFormData(initialFormData);
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await ApiService.updateNews(id, { published: !currentStatus });
      await loadNews();
      toast({
        title: "Success",
        description: `Article ${!currentStatus ? "published" : "unpublished"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neon-cyan">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-cyan">News Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* News List */}
      <div className="space-y-4">
        <AnimatePresence>
          {news.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="bg-card/40 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-neon-blue truncate">
                          {article.title}
                        </h3>
                        <Badge
                          className={`text-xs ${
                            article.category === "Awards"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : article.category === "Development"
                                ? "bg-blue-500/20 text-blue-400"
                                : article.category === "Company"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {article.published ? (
                            <Eye className="h-4 w-4 text-green-400" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-xs text-foreground/60">
                            {article.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/80 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-foreground/60">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="mr-1 h-3 w-3" />
                          {article.author}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={article.published}
                        onCheckedChange={() =>
                          togglePublished(article.id, article.published)
                        }
                        className="data-[state=checked]:bg-neon-cyan"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(article)}
                        className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* News Form Modal */}
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
                      {editingNews ? "Edit Article" : "Create New Article"}
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
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-neon-cyan">
                            Title *
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
                            onValueChange={(value: any) =>
                              setFormData((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-background/50 border-neon-cyan/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {NEWS_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="author" className="text-neon-cyan">
                            Author
                          </Label>
                          <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                author: e.target.value,
                              }))
                            }
                            placeholder="Author name (defaults to your name)"
                            className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="imageUrl" className="text-neon-cyan">
                            Image URL
                          </Label>
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
                            className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                published: checked,
                              }))
                            }
                            className="data-[state=checked]:bg-neon-cyan"
                          />
                          <Label htmlFor="published" className="text-neon-cyan">
                            Publish immediately
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="excerpt" className="text-neon-cyan">
                        Excerpt *
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        rows={3}
                        className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                        placeholder="Brief summary of the article..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content" className="text-neon-cyan">
                        Content *
                      </Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        rows={12}
                        className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
                        placeholder="Full article content..."
                        required
                      />
                    </div>

                    <Separator className="bg-neon-cyan/20" />

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
                        {editingNews ? "Update Article" : "Create Article"}
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
