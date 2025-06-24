import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
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
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Have a question, proposal, or just want to say hello? We'd love to
              hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto bg-card/30 glass border-neon-purple/20">
              <CardContent className="p-12">
                <div className="relative mb-8">
                  <MessageSquare className="h-16 w-16 text-neon-purple mx-auto animate-float" />
                  <div className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl" />
                </div>
                <h2 className="text-2xl font-bold text-neon-cyan mb-4">
                  Contact Form Coming Soon
                </h2>
                <p className="text-foreground/70 mb-8">
                  We're developing an advanced contact system that will make it
                  easy for you to reach out to us. For now, feel free to contact
                  us directly via email.
                </p>
                <div className="space-y-4">
                  <Button
                    className="w-full bg-neon-purple text-black hover:bg-neon-cyan hover:text-black transition-all duration-300"
                    asChild
                  >
                    <a href="mailto:contact@circuitdreamsstudios.com">
                      <Mail className="mr-2 h-4 w-4" />
                      contact@circuitdreamsstudios.com
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Join Our Discord
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
