import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ApiService, { SiteStats } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const initialData: SiteStats = {
  gamesDeveloped: "",
  teamMembers: "",
  yearsExperience: "",
  hoursThisWeek: "",
  tasksCompleted: "",
  teamRating: "",
};

export function StatsManager() {
  const [formData, setFormData] = useState<SiteStats>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Skip API calls in development mode
    const isDev = localStorage.getItem("cds_token") === "dev-token";

    if (isDev) {
      // Use development data immediately without API call
      setFormData({
        gamesDeveloped: "3",
        teamMembers: "12",
        yearsExperience: "2",
        hoursThisWeek: "156",
        tasksCompleted: "47",
        teamRating: "4.8",
      });
    }
    setIsLoading(false);
  };

  const handleChange = (field: keyof SiteStats, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isDev = localStorage.getItem("cds_token") === "dev-token";

    try {
      if (isDev) {
        // Handle development mode locally
        toast({ title: "Success", description: "Statistics updated" });
      } else {
        // Production API call
        await ApiService.updateStats(formData);
        toast({ title: "Success", description: "Statistics updated" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update statistics",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-neon-cyan">Loading stats...</div>;
  }

  return (
    <Card className="bg-card/40 glass border-neon-cyan/20">
      <CardHeader>
        <CardTitle className="text-neon-cyan">Site Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="games" className="text-neon-cyan">
              Games Developed
            </Label>
            <Input
              id="games"
              value={formData.gamesDeveloped}
              onChange={(e) => handleChange("gamesDeveloped", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div>
            <Label htmlFor="members" className="text-neon-cyan">
              Team Members
            </Label>
            <Input
              id="members"
              value={formData.teamMembers}
              onChange={(e) => handleChange("teamMembers", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div>
            <Label htmlFor="experience" className="text-neon-cyan">
              Years Experience
            </Label>
            <Input
              id="experience"
              value={formData.yearsExperience}
              onChange={(e) => handleChange("yearsExperience", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div>
            <Label htmlFor="hours" className="text-neon-cyan">
              Hours This Week
            </Label>
            <Input
              id="hours"
              value={formData.hoursThisWeek}
              onChange={(e) => handleChange("hoursThisWeek", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div>
            <Label htmlFor="tasks" className="text-neon-cyan">
              Tasks Completed
            </Label>
            <Input
              id="tasks"
              value={formData.tasksCompleted}
              onChange={(e) => handleChange("tasksCompleted", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div>
            <Label htmlFor="rating" className="text-neon-cyan">
              Team Rating
            </Label>
            <Input
              id="rating"
              value={formData.teamRating}
              onChange={(e) => handleChange("teamRating", e.target.value)}
              className="bg-background/50 border-neon-cyan/30 focus:border-neon-cyan"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-neon-cyan text-black hover:bg-neon-blue"
            >
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
