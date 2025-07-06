import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Crown,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ApiService from "@/services/api";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "CEO" | "Admin" | "TeamLead" | "Employee";
  position: string;
  isAdmin: boolean;
  createdAt: string;
  createdBy: string;
}

interface StaffForm {
  name: string;
  email: string;
  password: string;
  role: string;
  position: string;
}

const ROLE_COLORS = {
  CEO: "bg-gradient-to-r from-yellow-500 to-orange-500",
  Admin: "bg-gradient-to-r from-purple-500 to-pink-500",
  TeamLead: "bg-gradient-to-r from-blue-500 to-cyan-500",
  Employee: "bg-gradient-to-r from-green-500 to-emerald-500",
};

const ROLE_ICONS = {
  CEO: Crown,
  Admin: Shield,
  TeamLead: Users,
  Employee: UserPlus,
};

export function StaffManager() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffForm>({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    position: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      // Check if we're in development mode - skip API call
      const isDev = localStorage.getItem("cds_token") === "dev-token";

      if (isDev) {
        // Use development data immediately
        setStaff([
          {
            id: "1",
            name: "Alex Dowling",
            email: "AlexDowling@circuitdreamsstudios.com",
            role: "CEO",
            position: "Chief Executive Officer",
            isAdmin: true,
            createdAt: new Date().toISOString(),
            createdBy: "system",
          },
          {
            id: "2",
            name: "Maya Rodriguez",
            email: "maya@circuitdreamsstudios.com",
            role: "Admin",
            position: "Head of Development",
            isAdmin: true,
            createdAt: new Date().toISOString(),
            createdBy: "AlexDowling@circuitdreamsstudios.com",
          },
          {
            id: "3",
            name: "Jordan Kim",
            email: "jordan@circuitdreamsstudios.com",
            role: "Employee",
            position: "Lead Designer",
            isAdmin: false,
            createdAt: new Date().toISOString(),
            createdBy: "AlexDowling@circuitdreamsstudios.com",
          },
        ]);
      } else {
        const data = await ApiService.getUsers();
        setStaff(data);
      }
    } catch (error) {
      console.warn("Failed to load staff, using fallback data");
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.position) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // In development mode, simulate API call
      const isDev = localStorage.getItem("cds_token") === "dev-token";

      if (isDev) {
        const newStaffMember: StaffMember = {
          id: editingStaff ? editingStaff.id : Date.now().toString(),
          name: form.name,
          email: form.email,
          role: form.role as any,
          position: form.position,
          isAdmin: ["CEO", "Admin"].includes(form.role),
          createdAt: editingStaff
            ? editingStaff.createdAt
            : new Date().toISOString(),
          createdBy: editingStaff
            ? editingStaff.createdBy
            : user?.email || "unknown",
        };

        if (editingStaff) {
          setStaff((prev) =>
            prev.map((s) => (s.id === editingStaff.id ? newStaffMember : s)),
          );
          toast({
            title: "Success",
            description: "Staff member updated successfully",
          });
        } else {
          setStaff((prev) => [...prev, newStaffMember]);
          toast({
            title: "Success",
            description: "Staff member created successfully",
          });
        }

        // Reset form and close dialog
        setForm({
          name: "",
          email: "",
          password: "",
          role: "Employee",
          position: "",
        });
        setEditingStaff(null);
        setIsDialogOpen(false);
      } else {
        if (editingStaff) {
          await ApiService.updateUser(editingStaff.id, form);
        } else {
          await ApiService.createUser(form);
        }
        await loadStaff();
        toast({
          title: "Success",
          description: `Staff member ${editingStaff ? "updated" : "created"} successfully`,
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingStaff ? "update" : "create"} staff member`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setForm({
      name: staffMember.name,
      email: staffMember.email,
      password: "",
      role: staffMember.role,
      position: staffMember.position,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteStaff) return;

    try {
      const isDev = localStorage.getItem("cds_token") === "dev-token";

      if (isDev) {
        setStaff((prev) => prev.filter((s) => s.id !== deleteStaff.id));
        toast({
          title: "Success",
          description: "Staff member removed successfully",
        });
      } else {
        await ApiService.deleteUser(deleteStaff.id);
        await loadStaff();
        toast({
          title: "Success",
          description: "Staff member removed successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    } finally {
      setDeleteStaff(null);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "Employee",
      position: "",
    });
    setEditingStaff(null);
    setIsDialogOpen(false);
  };

  const getRoleIcon = (role: string) => {
    const Icon = ROLE_ICONS[role as keyof typeof ROLE_ICONS] || UserPlus;
    return Icon;
  };

  const canManageUser = (targetRole: string) => {
    if (user?.role === "CEO") return true;
    if (
      user?.role === "Admin" &&
      targetRole !== "CEO" &&
      targetRole !== "Admin"
    )
      return true;
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neon-cyan">
            Staff Management
          </h2>
          <p className="text-foreground/70">
            Manage your team members and their roles
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-neon-purple hover:bg-neon-purple/80 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-neon-purple/30">
            <DialogHeader>
              <DialogTitle className="text-neon-purple">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-neon-cyan">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  className="bg-background/50 border-neon-cyan/30"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-neon-cyan">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                  className="bg-background/50 border-neon-cyan/30"
                />
              </div>

              {!editingStaff && (
                <div>
                  <Label htmlFor="password" className="text-neon-cyan">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Create password"
                    className="bg-background/50 border-neon-cyan/30"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="role" className="text-neon-cyan">
                  Role
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="bg-background/50 border-neon-cyan/30">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.role === "CEO" && (
                      <SelectItem value="Admin">Admin</SelectItem>
                    )}
                    {["CEO", "Admin"].includes(user?.role || "") && (
                      <SelectItem value="TeamLead">Team Lead</SelectItem>
                    )}
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="position" className="text-neon-cyan">
                  Position/Title
                </Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, position: e.target.value }))
                  }
                  placeholder="e.g. Lead Developer, Designer, etc."
                  className="bg-background/50 border-neon-cyan/30"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="flex-1 bg-neon-purple hover:bg-neon-purple/80 text-black"
                >
                  {editingStaff ? "Update" : "Create"} Staff Member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member, index) => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-card/40 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full ${ROLE_COLORS[member.role]} flex items-center justify-center`}
                      >
                        <RoleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-foreground/70">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    {canManageUser(member.role) && member.role !== "CEO" && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(member)}
                          className="h-8 w-8 p-0 hover:bg-neon-blue/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteStaff(member)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${ROLE_COLORS[member.role]} text-white border-0`}
                      >
                        {member.role}
                      </Badge>
                      {member.isAdmin && (
                        <Badge
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400"
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neon-cyan">
                        {member.position}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">
                        Created{" "}
                        {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-foreground/60">
                        by {member.createdBy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground/70 mb-2">
            No staff members
          </h3>
          <p className="text-foreground/50 mb-4">
            Get started by adding your first team member
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-neon-purple hover:bg-neon-purple/80 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteStaff}
        onOpenChange={() => setDeleteStaff(null)}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">
              Remove Staff Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{deleteStaff?.name}</strong> from the team? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neon-cyan/30 text-neon-cyan">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove Staff Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
