import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { interpolate } from "@/lib/i18n";
import React from "react";

import { FlaskConical, Inbox, Sparkles, ExternalLink } from "lucide-react";

interface HomeSectionProps {
    navigate: (page: string) => void;
}

type Certification = {
    name: string;
    code: string;
    image: string;
    link: string;
    credId: string;
    inProgress: boolean;
};

const certifications: Certification[] = [
    {
        name: "AWS Certified Solutions Architect",
        code: "SAA-C03",
        image: "/certs/AWSSAA.png",
        link: "https://cp.certmetrics.com/amazon/en/public/verify/credential/GG3C2V61VBF4QDCP",
        credId: "GG3C2V61VBF4QDCP",
        inProgress: false,
    },
    {
        name: "Microsoft Certified: Azure Administrator Associate",
        code: "AZ-104",
        image: "/certs/AZ104.png",
        link: "https://learn.microsoft.com/api/credentials/share/en-us/SimonCheung-9261/86D0AC7A6C063680?sharingId=E3128B750A7AE2C1",
        credId: "86D0AC7A6C063680",
        inProgress: false,
    },
    {
        name: "eLearnSecurity Junior Penetration Tester",
        code: "eJPT",
        image: "/certs/eJPT.png",
        link: "https://certs.ine.com/1614ea62-93cf-478d-aad8-103fcb032584#acc.CWKE7QsS",
        credId: "157743669",
        inProgress: false,
    },
    {
        name: "Security Blue Team: Blue Team Level 1 (BTL1)",
        code: "BTL1",
        image: "/certs/BTL1.png",
        link: "https://www.credly.com/badges/0859bf60-47d8-4b93-b08a-7ce821253765/public_url",
        credId: "0859bf60-47d8-4b93-b08a-7ce821253765",
        inProgress: false,
    },
    {
        name: "Certified Kubernetes Administrator (CKA)",
        code: "CKA",
        image: "/certs/CKA.png",
        link: "",
        credId: "",
        inProgress: true,
    },
];

const HomeSection = ({ navigate }: HomeSectionProps) => {
    const { t } = useLanguage();
    
    return (
        <div className="space-y-12">
        {/* Hero Section */}
        <section 
            className="flex flex-col-reverse rounded-2xl shadow-2xl md:flex-row items-center justify-center min-h-[calc(100vh-160px)] py-16 px-8 md:px-16 gap-12 bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-100/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-blue-950/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50"
            aria-label="Hero section - Introduction"
        >
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                <motion.h1 
                    className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white leading-tight drop-shadow-2xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {t.home.greeting}{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {t.home.name}
                    </span>
                </motion.h1>
                <motion.p 
                    className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-medium drop-shadow-lg max-w-xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {interpolate(t.home.title, { 
                        fullStack: <span key="fs" className="text-blue-600 dark:text-blue-400 font-bold">{t.home.fullStack}</span>,
                        devOps: <span key="do" className="text-cyan-600 dark:text-cyan-400 font-bold">{t.home.devOps}</span>
                    }).map((part, i) => (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    ))}
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <motion.button
                        onClick={() => navigate("projects")}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-500 dark:to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-shadow duration-300 flex items-center justify-center gap-2"
                        aria-label="View my projects and portfolio"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FlaskConical className="w-5 h-5" />
                        {t.common.viewWork}
                    </motion.button>
                    <motion.button
                        onClick={() => navigate("contact")}
                        className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-300 dark:border-slate-600 px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
                        aria-label="Get in touch with me"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Inbox className="w-5 h-5" />
                        {t.common.getInTouch}
                    </motion.button>
                </motion.div>
            </div>
            <div className="md:w-1/2 flex flex-col items-center justify-center relative animate-slideInFromRight">
                <div className="relative flex flex-col items-center">
                    <CoinFlipPhoto />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                        <span className="w-5 h-1.5 rounded-full bg-blue-400 shadow-md animate-pulse" />
                        <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-md animate-bounce" />
                        <span className="w-5 h-1.5 rounded-full bg-blue-400 shadow-md animate-pulse" />
                    </div>
                </div>
            </div>
        </section>

        {/* About Section - Now Integrated */}
        <motion.section 
            className="py-16 px-6 bg-gradient-to-br from-white/80 via-slate-50/80 to-gray-100/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-blue-950/80 rounded-3xl shadow-2xl border border-slate-300 dark:border-slate-700 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
        >
            <h2 className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent mb-12 drop-shadow-lg tracking-tight">
                {t.home.aboutMe}
                <Sparkles className="w-10 h-10 text-blue-500 dark:text-blue-400 drop-shadow-md" />
            </h2>
            
            <div className="max-w-3xl mx-auto text-lg leading-relaxed text-slate-800 dark:text-slate-200 space-y-6">
                <p>
                    {interpolate(t.home.aboutParagraph1, {
                        cuhk: <a
                            key="cuhk"
                            href="https://www.cuhk.edu.hk/english/index.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors duration-300"
                        >
                            {t.home.cuhk}
                        </a>
                    }).map((part, i) => (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    ))}
                </p>
                <p>
                    {interpolate(t.home.aboutParagraph2, {
                        techStack: <span key="ts" className="font-semibold text-slate-700 dark:text-blue-300">{t.home.techStack}</span>,
                        cloudPlatforms: <span key="cp" className="font-semibold text-blue-600 dark:text-blue-400">{t.home.cloudPlatforms}</span>
                    }).map((part, i) => (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    ))}
                </p>
                <p>
                    {interpolate(t.home.aboutParagraph3, {
                        linkedIn: <a
                            key="li"
                            href="https://www.linkedin.com/in/iamtlcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-semibold transition-colors duration-300"
                        >
                            {t.home.linkedIn}
                        </a>,
                        github: <a
                            key="gh"
                            href="https://github.com/iamtlcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-semibold transition-colors duration-300"
                        >
                            {t.home.github}
                        </a>
                    }).map((part, i) => (
                        <React.Fragment key={i}>{part}</React.Fragment>
                    ))}
                </p>
            </div>

            {/* Certifications */}
            <div className="mt-14">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6 text-center tracking-tight flex items-center justify-center gap-2">
                    <span>{t.home.techCertifications}</span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
                    {certifications.map((cert) => {
                        const isInProgress = cert.inProgress;
                        
                        return isInProgress ? (
                            <motion.div
                                key={cert.name}
                                className="group relative rounded-2xl shadow-lg bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 dark:from-slate-800 dark:via-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 flex flex-col items-center p-6 min-h-[240px]"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + certifications.indexOf(cert) * 0.1 }}
                            >
                                <div className="absolute top-2 right-2 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 animate-pulse">
                                    {t.common.comingSoon}
                                </div>
                                <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                                    <Image
                                        src={cert.image}
                                        alt={cert.name}
                                        width={112}
                                        height={112}
                                        className="w-full h-full p-2 object-contain bg-white dark:bg-slate-700 rounded-xl shadow-lg grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
                                    />
                                </div>
                                <span className="block text-xs font-mono font-semibold mt-1 text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded px-2 py-1 mb-2">
                                    {cert.code}
                                </span>
                                <span className="block text-center text-sm font-bold text-orange-600 dark:text-orange-400 leading-tight">
                                    {cert.name}
                                </span>
                            </motion.div>
                        ) : (
                            <motion.a
                                key={cert.name}
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 flex flex-col items-center p-6 min-h-[240px]"
                                whileHover={{ scale: 1.05, y: -5 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + certifications.indexOf(cert) * 0.1 }}
                            >
                                <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                                    <Image
                                        src={cert.image}
                                        alt={cert.name}
                                        width={112}
                                        height={112}
                                        className="w-full h-full p-2 object-contain bg-white dark:bg-slate-700 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <span className="block text-xs font-mono font-semibold mt-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-2 py-1 mb-2">
                                    {cert.code}
                                </span>
                                <span className="block text-center text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                    {cert.name}
                                </span>
                                <ExternalLink className="absolute bottom-2 right-2 w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </motion.section>
        </div>
    );
};

function CoinFlipPhoto() {
    const { t } = useLanguage();
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="relative w-64 h-64 md:w-80 md:h-80 [perspective:1200px] cursor-pointer select-none group"
            onClick={() => setFlipped((f) => !f)}
        >
            <AnimatePresence initial={false}>
                <motion.div
                    key={flipped ? 'back' : 'front'}
                    initial={{ rotateY: flipped ? 180 : 0 }}
                    animate={{ rotateY: flipped ? 180 : 0, scale: [1, 1.08, 0.92, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{
                        rotateY: { duration: 1, type: 'spring', stiffness: 120, damping: 12 },
                        scale: { duration: 0.7, times: [0, 0.3, 0.7, 1] },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 [transform-style:preserve-3d] group-hover:shadow-2xl group-hover:scale-105 group-hover:ring-4 group-hover:ring-blue-300"
                    style={{
                        boxShadow:
                            "0 8px 32px 0 rgba(0,0,0,0.25), 0 0 0 8px #60a5fa, 0 0 32px 8px #3b82f6 inset",
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 60% 40%, #dbeafe 0%, #bfdbfe 100%)',
                    }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center">
                        <Image
                            src="/MyPhoto1.png"
                            alt="Simon Cheung Tak Leung Front"
                            width={320}
                            height={320}
                            className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-[10px] border-blue-400 shadow-xl group-hover:shadow-blue-300/60"
                            priority
                            style={{ filter: "brightness(1.08) contrast(1.1)" }}
                        />
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
                        <Image
                            src="/MyPhoto2.png"
                            alt="Simon Cheung Tak Leung Back"
                            width={320}
                            height={320}
                            className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover border-[10px] border-blue-400 shadow-xl group-hover:shadow-blue-300/60"
                            priority
                            style={{ filter: "brightness(1.08) contrast(1.1)" }}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-blue-400 bg-black/60 px-3 py-1 rounded-full shadow-lg select-none pointer-events-none animate-pulse group-hover:bg-blue-200 group-hover:text-black group-hover:scale-110 transition-all">
                {t.common.clickMe}
            </span>
        </div>
    );
}

export default HomeSection;
