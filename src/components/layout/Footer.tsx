import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Zap, Heart } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: "#", icon: Github },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  {
    name: "Email",
    href: "mailto:contact@circuitdreamsstudios.com",
    icon: Mail,
  },
];

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Projects", href: "/projects" },
      { name: "News", href: "/news" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { name: "Join Us", href: "/join" },
      { name: "Employee Portal", href: "/employee-portal" },
      { name: "Partnerships", href: "#" },
      { name: "Careers", href: "/join" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "Support", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-circuit-darker border-t border-neon-cyan/20">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 circuit-bg opacity-5" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="relative">
                <Zap className="h-8 w-8 text-neon-cyan group-hover:animate-neon-glow transition-all duration-300" />
                <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-xl group-hover:bg-neon-cyan/40 transition-all duration-300" />
              </div>
              <span className="text-xl font-bold gradient-text">
                CircuitDreamsStudios
              </span>
            </Link>

            <p className="text-foreground/70 mb-6 max-w-md">
              Where Dreams Become Games. We're an indie game development studio
              creating immersive experiences that push the boundaries of
              interactive entertainment.
            </p>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="group relative p-2 text-foreground/60 hover:text-neon-cyan transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon className="h-5 w-5 group-hover:neon-glow transition-all duration-300" />
                  <div className="absolute inset-0 bg-neon-cyan/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold text-neon-blue mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.2 + linkIndex * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className="text-foreground/60 hover:text-neon-cyan transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-neon-cyan/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm mb-4 md:mb-0">
              © 2024 CircuitDreamsStudios. All rights reserved.
            </p>

            <div className="flex items-center space-x-1 text-foreground/60 text-sm">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-neon-purple animate-pulse" />
              <span>and cutting-edge technology</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
