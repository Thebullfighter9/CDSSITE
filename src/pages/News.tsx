import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function News() {
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
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Stay up to date with the latest happenings at
              CircuitDreamsStudios. From development updates to industry
              insights.
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
                  <Newspaper className="h-16 w-16 text-neon-blue mx-auto animate-pulse" />
                  <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl" />
                </div>
                <h2 className="text-2xl font-bold text-neon-cyan mb-4">
                  News Center Coming Soon
                </h2>
                <p className="text-foreground/70 mb-8">
                  We're building a dynamic news center that will feature the
                  latest updates from our development team, industry insights,
                  behind-the-scenes content, and announcements about our
                  upcoming projects.
                </p>
                <Button
                  variant="outline"
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300"
                >
                  Subscribe to Updates
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
