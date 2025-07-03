import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ApiService, { SiteStats } from "@/services/api";

export function HeroSection() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    // Skip API calls in development mode
    const isDev = localStorage.getItem("cds_token") === "dev-token";

    if (isDev) {
      // Use development data immediately
      setStats({
        gamesDeveloped: "3",
        teamMembers: "12",
        yearsExperience: "2",
        hoursThisWeek: "40",
        tasksCompleted: "15",
        teamRating: "4.8",
      });
      return;
    }

    // API calls for production mode
    ApiService.getStats()
      .then(setStats)
      .catch(() => {
        // Use fallback stats if API fails
        setStats({
          gamesDeveloped: "3",
          teamMembers: "12",
          yearsExperience: "2",
          hoursThisWeek: "40",
          tasksCompleted: "15",
          teamRating: "4.8",
        });
      });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Circuit pattern */}
        <div className="absolute inset-0 circuit-bg opacity-10" />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-neon-blue/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple p-0.5">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-neon-cyan animate-neon-glow" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-xl animate-pulse" />
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            <span className="block gradient-text">Where Dreams</span>
            <span className="block text-neon-cyan">Become Games</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed"
          >
            We're an indie game development studio crafting immersive
            experiences that push the boundaries of interactive entertainment
            and storytelling.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="group bg-neon-cyan text-black hover:bg-neon-blue hover:text-white transition-all duration-300 px-8 py-6 text-lg font-semibold neon-glow"
            >
              Explore Our Games
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 pt-16 max-w-md mx-auto"
          >
            {[
              { label: "Games Developed", value: stats?.gamesDeveloped || "-" },
              { label: "Team Members", value: stats?.teamMembers || "-" },
              {
                label: "Years Experience",
                value: stats?.yearsExperience || "-",
              },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  className="text-2xl md:text-3xl font-bold text-neon-blue neon-glow"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-foreground/60 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
