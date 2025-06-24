import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmployeePortal() {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background to-circuit-darker">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              Employee Portal
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Secure access for CircuitDreamsStudios team members.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-card/30 glass border-neon-blue/20">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <Shield className="h-16 w-16 text-neon-blue mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl" />
                </div>
                <h2 className="text-2xl font-bold text-neon-cyan mb-4">
                  Portal Under Development
                </h2>
                <p className="text-foreground/70 mb-8">
                  We're developing a secure employee portal with time tracking,
                  project management tools, and internal resources. This will be
                  accessible only to authorized team members.
                </p>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Employee Login
                  </Button>
                  <p className="text-sm text-foreground/60">
                    For internal access only
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
