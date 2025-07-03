import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ApiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface TimesheetForm {
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
}

export function TimesheetManager() {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState<TimesheetForm>({
    employeeId: "",
    date: "",
    clockIn: "",
    clockOut: "",
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ts, emps] = await Promise.all([
        ApiService.getTimesheets(),
        ApiService.getEmployees(),
      ]);
      setTimesheets(ts);
      setEmployees(emps);
    } catch (error) {
      // Use fallback data in development
      console.warn("API failed, using fallback timesheet data");
      setTimesheets([
        {
          id: "1",
          employeeId: "1",
          employeeName: "Alex Dowling",
          date: new Date().toISOString().split("T")[0],
          hoursWorked: "8",
          project: "Circuit Dreams Alpha",
          description: "Implemented character dialogue system and bug fixes",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          employeeId: "2",
          employeeName: "Maya Rodriguez",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          hoursWorked: "7.5",
          project: "Circuit Toolkit",
          description:
            "Optimized asset pipeline and added new testing features",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          employeeId: "3",
          employeeName: "Jordan Kim",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          hoursWorked: "8",
          project: "Neon City VR",
          description: "Created concept art and level design prototypes",
          createdAt: new Date().toISOString(),
        },
      ]);
      setEmployees([
        {
          id: "1",
          name: "Alex Dowling",
          role: "CEO",
          position: "Chief Executive Officer",
        },
        {
          id: "2",
          name: "Maya Rodriguez",
          role: "Admin",
          position: "Head of Development",
        },
        {
          id: "3",
          name: "Jordan Kim",
          role: "Employee",
          position: "Lead Designer",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleChange = (field: keyof TimesheetForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await ApiService.updateTimesheet(editing.id, form);
        toast({ title: "Success", description: "Timesheet updated" });
      } else {
        await ApiService.addTimesheet(form);
        toast({ title: "Success", description: "Timesheet added" });
      }
      setForm({ employeeId: "", date: "", clockIn: "", clockOut: "" });
      setEditing(null);
      await loadData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save timesheet",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ts: any) => {
    setEditing(ts);
    setForm({
      employeeId: ts.employeeId,
      date: ts.date,
      clockIn: ts.clockIn,
      clockOut: ts.clockOut,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await ApiService.deleteTimesheet(id);
    await loadData();
  };

  if (isLoading) return <div className="p-8 text-neon-cyan">Loading...</div>;

  return (
    <Card className="bg-card/40 glass border-neon-cyan/20">
      <CardHeader>
        <CardTitle className="text-neon-cyan">Timesheets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div>
            <Label className="text-neon-cyan">Employee</Label>
            <select
              className="w-full bg-background/50 border border-neon-cyan/30 rounded-md h-9"
              value={form.employeeId}
              onChange={(e) => handleChange("employeeId", e.target.value)}
            >
              <option value="">Select</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
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
            <Label className="text-neon-cyan">Clock In</Label>
            <Input
              type="time"
              value={form.clockIn}
              onChange={(e) => handleChange("clockIn", e.target.value)}
              className="bg-background/50 border-neon-cyan/30"
            />
          </div>
          <div>
            <Label className="text-neon-cyan">Clock Out</Label>
            <Input
              type="time"
              value={form.clockOut}
              onChange={(e) => handleChange("clockOut", e.target.value)}
              className="bg-background/50 border-neon-cyan/30"
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
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
                <th className="p-2">Employee</th>
                <th className="p-2">Date</th>
                <th className="p-2">Clock In</th>
                <th className="p-2">Clock Out</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => (
                <tr key={ts.id} className="border-b border-neon-cyan/10">
                  <td className="p-2">
                    {employees.find((e) => e.id === ts.employeeId)?.name || "-"}
                  </td>
                  <td className="p-2">{ts.date}</td>
                  <td className="p-2">{ts.clockIn}</td>
                  <td className="p-2">{ts.clockOut}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ts)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500"
                      onClick={() => handleDelete(ts.id)}
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
