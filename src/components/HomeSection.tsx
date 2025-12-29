import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FlaskConical, Inbox } from "lucide-react";

interface HomeSectionProps {
    navigate: (page: string) => void;
}

const HomeSection = ({ navigate }: HomeSectionProps) => {
    return (
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
                    Hi, I&apos;m{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Simon, Cheung Tak Leung
                    </span>
                </motion.h1>
                <motion.p 
                    className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-medium drop-shadow-lg max-w-xl"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    A passionate <span className="text-blue-600 dark:text-blue-400 font-bold">Full Stack</span> &amp; <span className="text-cyan-600 dark:text-cyan-400 font-bold">DevOps Engineer</span> building scalable and dynamic web experiences.
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
                        View My Work
                    </motion.button>
                    <motion.button
                        onClick={() => navigate("contact")}
                        className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-300 dark:border-slate-600 px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
                        aria-label="Get in touch with me"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Inbox className="w-5 h-5" />
                        Get In Touch
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
    );
};

function CoinFlipPhoto() {
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
                Click Me!
            </span>
        </div>
    );
}

export default HomeSection;
