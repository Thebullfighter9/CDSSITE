import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Heart,
  Code,
  Palette,
  Music,
  Users,
  Target,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";
import ApiService from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    icon: Heart,
    title: "Passion-Driven",
    description:
      "We believe that the best games come from genuine passion and love for the craft.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We constantly push boundaries and explore new technologies to create unique experiences.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "Our players are at the heart of everything we do, guiding our creative decisions.",
  },
  {
    icon: Target,
    title: "Quality Obsessed",
    description:
      "We never compromise on quality, ensuring every detail meets our high standards.",
  },
];

const iconMap: Record<string, any> = { Code, Palette, Music, Rocket };

const milestones = [
  {
    year: "2016",
    event: "Studio Founded",
    description: "Started as a two-person indie team",
  },
  {
    year: "2018",
    event: "First Game Released",
    description: "Launched our debut title 'Pixel Dreams'",
  },
  {
    year: "2020",
    event: "Team Expansion",
    description: "Grew to 8 talented developers",
  },
  {
    year: "2022",
    event: "Major Partnership",
    description: "Signed with leading game publisher",
  },
  {
    year: "2024",
    event: "Next-Gen Focus",
    description: "Developing cutting-edge VR experiences",
  },
];

export default function About() {
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    ApiService.getEmployees().then(setTeam);
  }, []);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-background to-circuit-darker">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
              About CircuitDreamsStudios
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed">
              We're a passionate team of developers, designers, and dreamers
              dedicated to creating immersive gaming experiences that inspire,
              challenge, and entertain players around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neon-cyan mb-6 neon-glow">
                Our Mission
              </h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                At CircuitDreamsStudios, we believe that games are more than
                entertainment—they're gateways to new worlds, catalysts for
                creativity, and bridges that connect people across cultures and
                communities.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Our mission is to craft extraordinary interactive experiences
                that push the boundaries of what's possible in gaming. We
                combine cutting-edge technology with innovative storytelling to
                create games that resonate on a deeper level.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                Every line of code we write, every pixel we place, and every
                sound we design is infused with our passion for creating
                something truly special.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-neon-cyan/20 via-neon-blue/20 to-neon-purple/20 rounded-2xl relative overflow-hidden glass">
                <div className="absolute inset-0 circuit-bg opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple p-1">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <Heart className="w-16 h-16 text-neon-cyan animate-neon-glow" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold gradient-text">
                      Passion in Every Pixel
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core Values
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              These principles guide every decision we make and every game we
              create.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-card/50 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <value.icon className="h-12 w-12 text-neon-blue mx-auto group-hover:animate-neon-glow transition-all duration-300" />
                      <div className="absolute inset-0 bg-neon-blue/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-neon-cyan mb-3">
                      {value.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Team
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              The creative minds behind CircuitDreamsStudios, united by passion
              and driven by innovation.
            </p>
          </motion.div>

          {team.length === 0 ? (
            <p className="text-foreground/70 text-center">No Team Members Yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => {
                const Icon = iconMap[member.icon as string] || Code;
                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                  <Card className="h-full bg-card/30 glass border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-6">
                        <div
                          className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-${member.color} to-neon-blue p-1`}
                      >
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <Icon className={`h-10 w-10 text-${member.color}`} />
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 bg-${member.color}/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className={`text-${member.color} font-medium mb-4`}>
                      {member.role}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="outline"
                          className={`text-xs border-${member.color}/30 text-${member.color}/80`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              From humble beginnings to industry recognition, here's how our
              story has unfolded.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center mb-12 last:mb-0"
              >
                <div className="flex-1 text-right pr-8">
                  {index % 2 === 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-neon-cyan mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-foreground/70">
                        {milestone.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple rounded-full flex items-center justify-center font-bold text-black">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-neon-cyan to-neon-blue" />
                  )}
                </div>

                <div className="flex-1 text-left pl-8">
                  {index % 2 === 1 && (
                    <div>
                      <h3 className="text-xl font-bold text-neon-cyan mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-foreground/70">
                        {milestone.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
