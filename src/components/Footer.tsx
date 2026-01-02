"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { Icon: Github, href: "https://github.com/iamtlcs", label: "GitHub" },
              { Icon: Linkedin, href: "https://linkedin.com/in/iamtlcs", label: "LinkedIn" },
              { Icon: Mail, href: "mailto:simoncheung2002@gmail.com", label: "Email" }
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            &copy; {currentYear} CHEUNG TAK LEUNG. All rights reserved.
          </p>

          {/* Built with */}
          <motion.p 
            className="text-sm text-slate-500 dark:text-slate-500 text-center flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Built with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="w-4 h-4 inline text-red-500 fill-current" />
            </motion.span>
            {" "}using{" "}
            <span className="font-semibold text-slate-700 dark:text-blue-400">Next.js</span>
            {", "}
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">Tailwind CSS</span>
            {" and "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">Framer Motion</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
