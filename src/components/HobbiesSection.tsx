'use client';

import React from "react";
import { motion } from "framer-motion";
import { Puzzle } from "lucide-react";
import SpotifyWidget from "./SpotifyWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { interpolate } from "@/lib/i18n";

const HobbiesSection = () => {
    const { t } = useLanguage();
    
    const hobbies = [
        {
            name: t.hobbies.hobbies.movies.name,
            icon: "fas fa-film",
            description: t.hobbies.hobbies.movies.description,
        },
        {
            name: t.hobbies.hobbies.football.name,
            icon: "fas fa-futbol",
            description: t.hobbies.hobbies.football.description,
        },
        {
            name: t.hobbies.hobbies.reading.name,
            icon: "fas fa-book-open",
            description: t.hobbies.hobbies.reading.description,
        },
        {
            name: t.hobbies.hobbies.algoTrading.name,
            icon: "fas fa-chart-line",
            description: t.hobbies.hobbies.algoTrading.description,
        },
        {
            name: t.hobbies.hobbies.traveling.name,
            icon: "fas fa-plane",
            description: t.hobbies.hobbies.traveling.description,
        },
        {
            name: t.hobbies.hobbies.gaming.name,
            icon: "fas fa-gamepad",
            description: t.hobbies.hobbies.gaming.description,
        },
        {
            name: t.hobbies.hobbies.coding.name,
            icon: "fas fa-code",
            description: t.hobbies.hobbies.coding.description,
        },
    ];

    return (
        <section className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <motion.div 
                className="text-center mb-12 relative z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
                    <Puzzle className="w-12 h-12 text-purple-400" />
                    {t.hobbies.title}
                </h2>
                <p className="text-xl text-slate-300 mb-2 font-semibold">
                    {t.hobbies.subtitle}
                </p>
                <p className="text-sm text-slate-400 font-mono">
                    {t.hobbies.personality}
                </p>
            </motion.div>

            <motion.div 
                className="max-w-4xl mx-auto text-lg leading-relaxed mb-12 rounded-2xl backdrop-blur-sm p-8 border border-slate-700/50"
                style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    boxShadow: '0 0 40px rgba(147, 51, 234, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <p className="text-center mb-6 text-slate-300">
                    {interpolate(t.hobbies.introParagraph1, { intp: <span key="intp" className="font-semibold text-purple-400">{t.hobbies.intp}</span> }).map((part, i) => (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    ))}
                </p>
                <p className="text-center text-slate-300">
                    {t.hobbies.introParagraph2}
                </p>
            </motion.div>

            {/* Spotify Now Playing Widget */}
            <motion.div 
                className="max-w-2xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-2xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <span className="text-green-400">♫</span>
                    {t.hobbies.currentlyListening}
                </h3>
                <SpotifyWidget />
                <p className="text-xs text-center text-slate-500 mt-2 font-mono">
                    {t.hobbies.spotifyIntegration}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {hobbies.map((hobby, index) => (
                    <motion.div
                        key={index}
                        className="group flex flex-col items-center p-6 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                            boxShadow: '0 0 30px rgba(147, 51, 234, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.3)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <div className="mb-4">
                            <i
                                className={`${hobby.icon} text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-5xl`}
                            ></i>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            {hobby.name}
                        </h3>
                        <p className="text-center text-slate-300 text-sm leading-relaxed">
                            {hobby.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HobbiesSection;
