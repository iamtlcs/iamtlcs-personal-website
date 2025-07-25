"use client";

import { useState, useEffect } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-900 text-white py-6 mt-8 rounded-t-2xl shadow-2xl">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {currentYear} CHEUNG TAK LEUNG. All rights reserved.</p>
        <p className="mt-2">Built with <span className="text-blue-400">Next.js</span>, <span className="text-cyan-400">Tailwind CSS</span> and my passion.</p>
      </div>
    </footer>
  );
};

export default Footer;
