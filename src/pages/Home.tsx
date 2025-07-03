import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { motion } from "framer-motion";
import { Code, Users, Zap, Target, Gamepad2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ApiService, { Project } from "@/services/api";

const features = [
  {
    icon: Gamepad2,
    title: "Game Development",
    description:
      "Creating immersive gaming experiences with cutting-edge technology and innovative storytelling.",
  },
  {
    icon: Code,
    title: "Custom Software",
    description:
      "Building tailored software solutions that solve real-world problems with elegant code.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Working together to bring creative visions to life through agile development practices.",
  },
  {
    icon: Target,
    title: "Precision Focus",
    description:
      "Delivering pixel-perfect results with attention to detail and performance optimization.",
  },
];

const colorOrder = ["neon-cyan", "neon-blue", "neon-purple"] as const;
const colorStyles: Record<(typeof colorOrder)[number], string> = {
  "neon-cyan": "text-neon-cyan border-neon-cyan hover:bg-neon-cyan",
  "neon-blue": "text-neon-blue border-neon-blue hover:bg-neon-blue",
  "neon-purple": "text-neon-purple border-neon-purple hover:bg-neon-purple",
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    ApiService.getProjects()
      .then(setProjects)
      .catch(() => {
        // Use fallback projects if API fails
        setProjects([
          {
            id: "1",
            title: "Circuit Dreams Alpha",
            category: "Game Development",
            description: "Our flagship cyberpunk adventure game",
            status: "In Development",
            tags: ["Cyberpunk", "Adventure", "Story-driven"],
            releaseDate: "2024-Q3",
            imageUrl: "",
            features: [
              "Open World",
              "Character Customization",
              "Multiple Endings",
            ],
            teamMembers: ["Alex Dowling", "Maya Rodriguez", "Jordan Kim"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "Alex Dowling",
          },
          {
            id: "2",
            title: "Neon City VR",
            category: "VR Experience",
            description: "Immersive virtual reality city exploration",
            status: "Concept",
            tags: ["VR", "Exploration", "City"],
            releaseDate: "2024-Q4",
            imageUrl: "",
            features: ["VR Compatible", "Procedural Generation", "Multiplayer"],
            teamMembers: ["Alex Dowling", "Jordan Kim"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "Alex Dowling",
          },
        ]);
      });
  }, []);

  return (
    <Layout>
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-circuit-darker">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              What We Do Best
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              We combine technical expertise with creative vision to deliver
              exceptional digital experiences that captivate and inspire.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <feature.icon className="h-12 w-12 text-neon-cyan mx-auto group-hover:animate-neon-glow transition-all duration-300" />
                      <div className="absolute inset-0 bg-neon-cyan/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-neon-blue mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Featured Projects
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Take a look at some of our latest creations that showcase our
              passion for innovative game development.
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <p className="text-foreground/70 text-center">No Projects Yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project, index) => {
                const color = colorOrder[index % colorOrder.length];
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="h-full bg-card/30 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-neon-cyan/20 via-neon-blue/20 to-neon-purple/20 relative overflow-hidden">
                        <div className="absolute inset-0 circuit-bg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              project.status === "Released"
                                ? "bg-green-500/20 text-green-400"
                                : project.status === "In Development"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Trophy
                            className={`h-8 w-8 ${colorStyles[color].split(" ")[0]} group-hover:animate-float`}
                          />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-2">
                          <span
                            className={`text-sm ${colorStyles[color].split(" ")[0]} font-medium`}
                          >
                            {project.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-3">
                          {project.title}
                        </h3>
                        <p className="text-foreground/70 mb-4">
                          {project.description}
                        </p>
                        <Button
                          variant="outline"
                          className={`w-full ${colorStyles[color]} hover:text-black transition-all duration-300`}
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-circuit-darker">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-foreground/70 text-lg mb-8">
              Join our team of creative developers or partner with us to bring
              your gaming vision to life. Let's create the future of interactive
              entertainment together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300 px-8 py-6 text-lg font-semibold neon-glow"
              >
                Join Our Team
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300 px-8 py-6 text-lg font-semibold"
              >
                Start a Project
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
