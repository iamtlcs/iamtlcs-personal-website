"use client";

import { motion } from "framer-motion";
import { Mail, Download, Github, Linkedin, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
    const { t } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDownloadCV = () => {
        if (!isMounted) return;
        // Direct download link for Google Drive (ensure file is shared as "Anyone with the link")
        const googleDriveDownloadUrl = "https://drive.google.com/uc?export=download&id=1x7Nfu0Xqjq6Sk-h57fwJirOWXWF6FnR4";
        const link = document.createElement("a");
        link.href = googleDriveDownloadUrl;
        link.setAttribute("download", "SIMON_CHEUNG_TAK_LEUNG_CV.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <motion.div 
                className="text-center mb-12 relative z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                        {t.contact.title}
                    </h2>
                    <Mail className="w-12 h-12 text-emerald-400" />
                </div>
                <p className="text-xl text-slate-300 mb-2 font-semibold">
                    {t.contact.subtitle}
                </p>
                <p className="text-sm text-slate-400 font-mono">
                    {t.contact.description}
                </p>
            </motion.div>

            <motion.div 
                className="max-w-3xl mx-auto text-center rounded-2xl backdrop-blur-sm p-8 border border-slate-700/50 mb-12"
                style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    boxShadow: '0 0 40px rgba(16, 185, 129, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-lg leading-relaxed text-slate-300 mb-8">
                    {t.contact.message}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                    <motion.button
                        onClick={handleDownloadCV}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 border border-emerald-500/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download className="w-5 h-5" />
                        {t.common.downloadCV}
                    </motion.button>
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
                <h3 className="text-2xl font-semibold text-slate-200 mb-6 text-center">
                    {t.common.connectWithMe}
                </h3>
                <div className="flex justify-center gap-6">
                    <motion.a
                        href="https://github.com/iamtlcs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 backdrop-blur-sm transition-all duration-300"
                        style={{
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                        }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Github className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                        href="https://www.linkedin.com/in/iamtlcs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-800/50 text-slate-300 hover:text-blue-400 border border-slate-700/50 backdrop-blur-sm transition-all duration-300"
                        style={{
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                        }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Linkedin className="w-8 h-8" />
                    </motion.a>
                    <motion.a
                        href="https://discord.com/users/tahithchongluton"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-slate-800/50 text-slate-300 hover:text-indigo-400 border border-slate-700/50 backdrop-blur-sm transition-all duration-300"
                        style={{
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)'
                        }}
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
