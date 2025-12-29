"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import ThemeToggle from "./ThemeToggle";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
    navigate: (page: string) => void;
    currentPage: string;
    className?: string;
}

const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Architecture", id: "architecture" },
    { name: "Origin", id: "hongkong" },
    { name: "Hobbies", id: "hobbies" },
    { name: "Contact", id: "contact" },
];

const Header = ({ navigate, currentPage, className }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scroll detection for glassmorphism effect
    useEffect(() => {
        if (!isMounted) return;
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted || !isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, isMounted]);

    return (
        <motion.header 
            className={`sticky top-0 z-50 transition-all duration-300 ${className || ''} ${
                scrolled 
                    ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl border-b border-white/20 dark:border-slate-700/50' 
                    : 'bg-gradient-to-r from-slate-700/90 via-blue-600/90 to-indigo-700/90 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-blue-900/80 backdrop-blur-lg'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            role="banner"
            aria-label="Main site header"
        >
            <nav 
                className="container mx-auto flex justify-between items-center relative px-6 py-4"
                role="navigation"
                aria-label="Main navigation"
            >
                <motion.button
                    className={`text-2xl font-bold transition-all duration-300 cursor-pointer bg-transparent border-none flex items-center gap-2 ${
                        scrolled 
                            ? 'text-slate-800 dark:text-white' 
                            : 'text-white'
                    }`}
                    onClick={() => navigate("home")}
                    aria-label="Go to Home - Simon Cheung Tak Leung"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Sparkles className="w-6 h-6 text-blue-400 dark:text-blue-300" />
                    <span className="hidden sm:inline">Simon Cheung Tak Leung</span>
                    <span className="sm:hidden">SCTL</span>
                </motion.button>
                
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <Suspense fallback={<div className="w-14 h-14" />}>
                        <ThemeToggle />
                    </Suspense>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsOpen((open) => !open)}
                        className={`md:hidden rounded-xl p-2 focus:outline-none ${
                            scrolled 
                                ? 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800' 
                                : 'text-white hover:bg-white/10'
                        }`}
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </motion.button>
                </div>
                {/* Desktop Navigation */}
                <ul className="hidden md:flex md:items-center md:space-x-2">
                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <motion.button
                                onClick={() => navigate(item.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none relative overflow-hidden ${
                                    currentPage === item.id
                                        ? scrolled
                                            ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                                            : 'text-blue-300 bg-white/20 backdrop-blur-sm'
                                        : scrolled
                                            ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            : 'text-white hover:bg-white/10'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-current={currentPage === item.id ? "page" : undefined}
                            >
                                {currentPage === item.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl"
                                        layoutId="activeTab"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{item.name}</span>
                            </motion.button>
                        </motion.li>
                    ))}
                </ul>

                {/* Mobile Navigation */}
                <motion.ul
                    ref={menuRef}
                    id="mobile-navigation"
                    className={`md:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden ${
                        isOpen ? "block" : "hidden"
                    } bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-700/50`}
                    initial={false}
                    animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {navItems.map((item, index) => (
                        <motion.li
                            key={item.id}
                            initial={false}
                            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: isOpen ? index * 0.05 : 0 }}
                            className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0"
                        >
                            <motion.button
                                onClick={() => {
                                    navigate(item.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-6 py-4 text-base font-medium transition-all duration-200 focus:outline-none ${
                                    currentPage === item.id
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                                whileTap={{ scale: 0.98 }}
                                aria-current={currentPage === item.id ? "page" : undefined}
                            >
                                {item.name}
                            </motion.button>
                        </motion.li>
                    ))}
                </motion.ul>
            </nav>
        </motion.header>
    );
};

export default Header;
