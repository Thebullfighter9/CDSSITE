import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Calendar,
  Eye,
  CheckCircle,
  MessageSquare,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ApiService, { ContactSubmission } from "@/services/api";

const STATUS_COLORS = {
  New: "bg-blue-500/20 text-blue-400",
  Read: "bg-yellow-500/20 text-yellow-400",
  Responded: "bg-green-500/20 text-green-400",
  Resolved: "bg-gray-500/20 text-gray-400",
};

export function ContactManager() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    // Skip API calls in development mode
    const isDev = localStorage.getItem("cds_token") === "dev-token";

    if (isDev) {
      // Use development data immediately without API call
      setContacts([
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@techcorp.com",
          subject: "Partnership Opportunity",
          message:
            "Hi, I'm interested in discussing a potential partnership for our upcoming game project. We think CircuitDreamsStudios would be a great fit.",
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: "New",
        },
        {
          id: "2",
          name: "Mike Chen",
          email: "mike.chen@gamestudio.io",
          subject: "Collaboration Request",
          message:
            "We're working on a cyberpunk-themed project and would love to collaborate on art assets. Your style perfectly matches our vision.",
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          status: "Read",
        },
        {
          id: "3",
          name: "Emma Rodriguez",
          email: "emma@indiegamer.net",
          subject: "Interview Request",
          message:
            "I'm a journalist covering indie game development. Could I interview Alex Dowling about CircuitDreamsStudios' journey?",
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          status: "Responded",
        },
      ]);
      setIsLoading(false);
      return;
    }

    // API calls for production mode would go here
    setIsLoading(false);
  };

  const updateStatus = async (
    id: string,
    status: ContactSubmission["status"],
  ) => {
    try {
      await ApiService.updateContactStatus(id, status);
      await loadContacts();
      toast({
        title: "Success",
        description: "Contact status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    statusFilter === "all" ? true : contact.status === statusFilter,
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neon-cyan">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-cyan">
          Contact Management
        </h2>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-background/50 border-neon-cyan/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Read">Read</SelectItem>
              <SelectItem value="Responded">Responded</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {contacts.length === 0 ? (
        <Card className="bg-card/40 glass border-neon-cyan/20">
          <CardContent className="p-12 text-center">
            <Mail className="h-16 w-16 text-neon-cyan/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neon-cyan mb-2">
              No Contact Submissions
            </h3>
            <p className="text-foreground/70">
              Contact form submissions will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neon-blue">
              Contact Submissions ({filteredContacts.length})
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card
                      className={`bg-card/40 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 cursor-pointer ${
                        selectedContact?.id === contact.id
                          ? "border-neon-cyan/60 bg-neon-cyan/5"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedContact(contact);
                        if (contact.status === "New") {
                          updateStatus(contact.id, "Read");
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-neon-blue truncate">
                              {contact.subject}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <User className="h-3 w-3" />
                              {contact.name}
                              <span>•</span>
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                          </div>
                          <Badge className={STATUS_COLORS[contact.status]}>
                            {contact.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground/80 mb-2 line-clamp-2">
                          {contact.message}
                        </p>
                        <div className="flex items-center text-xs text-foreground/60">
                          <Clock className="mr-1 h-3 w-3" />
                          {getTimeAgo(contact.submittedAt)}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            {selectedContact ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-neon-blue">
                  Contact Details
                </h3>
                <Card className="bg-card/40 glass border-neon-cyan/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-neon-cyan">
                          {selectedContact.subject}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-foreground/70 mt-2">
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {selectedContact.name}
                          </div>
                          <div className="flex items-center">
                            <Mail className="mr-1 h-3 w-3" />
                            {selectedContact.email}
                          </div>
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[selectedContact.status]}>
                        {selectedContact.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-neon-blue mb-2">
                        Message:
                      </h4>
                      <div className="bg-background/30 p-4 rounded-lg border border-neon-cyan/20">
                        <p className="text-foreground/90 whitespace-pre-wrap">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-foreground/60">
                      <Calendar className="mr-1 h-3 w-3" />
                      Submitted on{" "}
                      {new Date(selectedContact.submittedAt).toLocaleString()}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-neon-blue">
                        Update Status:
                      </h4>
                      <div className="flex gap-2">
                        {["New", "Read", "Responded", "Resolved"].map(
                          (status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={
                                selectedContact.status === status
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() =>
                                updateStatus(
                                  selectedContact.id,
                                  status as ContactSubmission["status"],
                                )
                              }
                              className={
                                selectedContact.status === status
                                  ? "bg-neon-cyan text-black"
                                  : "border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan hover:text-black"
                              }
                            >
                              {status}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neon-cyan/20">
                      <Button
                        asChild
                        className="w-full bg-neon-purple text-black hover:bg-neon-cyan hover:text-black transition-all duration-300"
                      >
                        <a href={`mailto:${selectedContact.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Reply via Email
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-card/40 glass border-neon-cyan/20">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-16 w-16 text-neon-cyan/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neon-cyan mb-2">
                    Select a Contact
                  </h3>
                  <p className="text-foreground/70">
                    Choose a contact submission to view details and manage its
                    status.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
