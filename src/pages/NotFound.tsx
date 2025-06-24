import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-background to-circuit-darker min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-card/30 glass border-neon-cyan/20">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <AlertTriangle className="h-24 w-24 text-neon-cyan mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl" />
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-8xl font-bold gradient-text mb-4"
                >
                  404
                </motion.h1>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-neon-blue mb-4"
                >
                  Page Not Found
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-foreground/70 mb-8 leading-relaxed"
                >
                  The page you're looking for seems to have gotten lost in the
                  digital void. Don't worry, even the best navigators sometimes
                  take a wrong turn in cyberspace.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <Button
                    asChild
                    className="w-full bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300"
                  >
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      Return Home
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
