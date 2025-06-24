import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Gamepad2, Calendar, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
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
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Explore our portfolio of innovative games and interactive
              experiences. Each project represents our commitment to pushing
              creative boundaries.
            </p>
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-card/30 glass border-neon-cyan/20">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <Gamepad2 className="h-16 w-16 text-neon-cyan mx-auto animate-neon-glow" />
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl" />
                </div>
                <h2 className="text-2xl font-bold text-neon-blue mb-4">
                  Projects Gallery Coming Soon
                </h2>
                <p className="text-foreground/70 mb-8">
                  We're currently working on an amazing showcase of our games
                  and projects. This section will feature detailed information
                  about our current and upcoming releases, including
                  screenshots, gameplay videos, and development insights.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  <Badge className="bg-neon-cyan/20 text-neon-cyan">
                    Game Gallery
                  </Badge>
                  <Badge className="bg-neon-blue/20 text-neon-blue">
                    Project Details
                  </Badge>
                  <Badge className="bg-neon-purple/20 text-neon-purple">
                    Development Blog
                  </Badge>
                </div>
                <Button className="bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Stay Updated
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
