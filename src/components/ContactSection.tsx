"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
    const { t } = useLanguage();

    return (
        <section className="content-section min-h-[70dvh] py-10 sm:py-16 px-4 sm:px-6 relative">
            <motion.div 
                className="text-center mb-12 relative z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                        {t.contact.title}
                    </h2>
                    <Mail className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 text-emerald-400" />
                </div>
                <p className="text-base sm:text-xl theme-muted mb-2 font-semibold">
                    {t.contact.subtitle}
                </p>
                <p className="text-sm theme-muted font-mono">
                    {t.contact.description}
                </p>
            </motion.div>

            <motion.div 
                className="theme-card max-w-3xl mx-auto text-center rounded-2xl p-5 sm:p-8 border mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-base sm:text-lg leading-relaxed theme-muted mb-8">
                    {t.contact.message}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                    <motion.a
                        href="mailto:simoncheung2002@gmail.com"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 border border-blue-500/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Mail className="w-5 h-5" />
                        {t.common.emailMe}
                    </motion.a>
                </div>
            </motion.div>

            <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
                    {t.common.connectWithMe}
                </h3>
                <div className="flex justify-center gap-6">
                    <motion.a
                        aria-label="GitHub"
                        href="https://github.com/iamtlcs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-slate-600 backdrop-blur-sm transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Github className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                        aria-label="LinkedIn"
                        href="https://www.linkedin.com/in/iamtlcs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-300 dark:border-slate-600 backdrop-blur-sm transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Linkedin className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                        aria-label="Discord"
                        href="https://discord.com/users/tahithchongluton"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-300 dark:border-slate-600 backdrop-blur-sm transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <MessageCircle className="w-8 h-8" />
                    </motion.a>
                </div>
            </motion.div>
        </section>
    );
};

export default ContactSection;
