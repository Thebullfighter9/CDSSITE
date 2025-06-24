import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Users, Rocket, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinUs() {
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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Be part of something extraordinary. Help us create the next
              generation of gaming experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-card/30 glass border-neon-cyan/20">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <Users className="h-16 w-16 text-neon-cyan mx-auto animate-glow-pulse" />
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl" />
                </div>
                <h2 className="text-2xl font-bold text-neon-blue mb-4">
                  Careers Portal Coming Soon
                </h2>
                <p className="text-foreground/70 mb-8">
                  We're building a comprehensive careers portal where you'll be
                  able to explore open positions, learn about our culture, and
                  apply to join our talented team of developers and creatives.
                </p>
                <div className="space-y-4">
                  <Button className="w-full bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300">
                    <Heart className="mr-2 h-4 w-4" />
                    Join Our Community
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    View Open Positions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
