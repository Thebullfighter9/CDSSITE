import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/auth/Dashboard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function EmployeePortal() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mx-auto mb-4" />
          <p className="text-foreground/70">Loading employee portal...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginForm />;
}
