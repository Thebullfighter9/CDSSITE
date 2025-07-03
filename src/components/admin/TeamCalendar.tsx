import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface EventForm {
  title: string;
  date: string;
  description: string;
}

export function TeamCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState<EventForm>({
    title: "",
    date: "",
    description: "",
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await ApiService.getCalendar();
      setEvents(data);
    } catch (error) {
      // Use fallback data in development
      console.warn("API failed, using fallback calendar data");
      setEvents([
        {
          id: "1",
          title: "Sprint Planning Meeting",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // Tomorrow
          time: "10:00",
          type: "Meeting",
          description:
            "Plan the next development sprint for Circuit Dreams Alpha",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Circuit Dreams Alpha - Beta Release",
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 30 days
          time: "09:00",
          type: "Deadline",
          description: "Target date for Circuit Dreams Alpha beta release",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Team Building Event",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // Next week
          time: "15:00",
          type: "Event",
          description: "Team outing to celebrate recent milestones",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Code Review Session",
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // 3 days
          time: "14:00",
          type: "Meeting",
          description: "Review recent code changes and discuss improvements",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleChange = (field: keyof EventForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await ApiService.updateEvent(editing.id, form);
        toast({ title: "Success", description: "Event updated" });
      } else {
        await ApiService.addEvent(form);
        toast({ title: "Success", description: "Event added" });
      }
      setForm({ title: "", date: "", description: "" });
      setEditing(null);
      await loadEvents();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ev: any) => {
    setEditing(ev);
    setForm({ title: ev.title, date: ev.date, description: ev.description });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await ApiService.deleteEvent(id);
    await loadEvents();
  };

  if (isLoading) return <div className="p-8 text-neon-cyan">Loading...</div>;

  return (
    <Card className="bg-card/40 glass border-neon-cyan/20">
      <CardHeader>
        <CardTitle className="text-neon-cyan">Team Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <Label className="text-neon-cyan">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-background/50 border-neon-cyan/30"
            />
          </div>
          <div>
            <Label className="text-neon-cyan">Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="bg-background/50 border-neon-cyan/30"
            />
          </div>
          <div>
            <Label className="text-neon-cyan">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-background/50 border-neon-cyan/30"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button
              type="submit"
              className="bg-neon-cyan text-black hover:bg-neon-blue"
            >
              {editing ? "Update" : "Add"}
            </Button>
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neon-cyan">
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Description</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b border-neon-cyan/10">
                  <td className="p-2">{ev.title}</td>
                  <td className="p-2">{ev.date}</td>
                  <td className="p-2">{ev.description}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ev)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
