'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket, ExternalLink, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProjectsSection = () => {
    const { t } = useLanguage();
    
    const projects = [
        {
            title: t.projects.items.thisWebsite.title,
            description: t.projects.items.thisWebsite.description,
            image: "/projects/FrontendDev.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/iamtlcs-personal-website",
            technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
            isSecret: false,
            isGitHub: true,
        },
        {
            title: t.projects.items.urlShortener.title,
            description: t.projects.items.urlShortener.description,
            image: "/projects/URLShortenerTFAWS.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/url-shortener",
            technologies: [
                "AWS",
                "Terraform",
                "Lambda",
                "API Gateway",
                "DynamoDB",
            ],
            isSecret: false,
            isGitHub: true,
        },
        {
            title: t.projects.items.ecsBlueGreen.title,
            description: t.projects.items.ecsBlueGreen.description,
            image: "/projects/ecsBlueGreenTFAWS.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/ecs-bluegreen",
            technologies: [
                "AWS ECS",
                "Terraform",
                "ALB",
                "CodeDeploy",
                "CI/CD",
            ],
            isSecret: false,
            isGitHub: true,
        },
        {
            title: t.projects.items.shell.title,
            description: t.projects.items.shell.description,
            image: "/projects/MakeMyOwnShell.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/make-my-own-shell",
            technologies: ["C", "Shell", "Unix", "Operating System"],
            isSecret: false,
            isGitHub: true,
        },
        {
            title: t.projects.items.stateMachine.title,
            description: t.projects.items.stateMachine.description,
            image: "/projects/FanoutConcurrency.png",
            demoLink: "",
            githubLink: "",
            technologies: [
                "AWS Step Functions",
                "Lambda",
                "SQS",
                "Concurrency Control",
            ],
            isSecret: true,
            isGitHub: false,
        },
        {
            title: t.projects.items.algoTrading.title,
            description: t.projects.items.algoTrading.description,
            image: "/projects/AlgoTradingCompetition.png",
            demoLink: "",
            githubLink: "",
            technologies: [
                "Python",
                "Time Series Analysis",
                "Trading Algorithms",
            ],
            isSecret: false,
            isGitHub: false,
        },
        {
            title: t.projects.items.algoTradingResearch.title,
            description: t.projects.items.algoTradingResearch.description,
            image: "/projects/AlgoTradingSelfResearch.png",
            demoLink: "",
            githubLink: "",
            technologies: [
                "Python",
                "Pandas",
                "NumPy",
                "Matplotlib",
                "Trading Strategies",
            ],
        },
        {
            title: t.projects.items.artClassification.title,
            description: t.projects.items.artClassification.description,
            image: "/projects/ArtClassification.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/image-classification",
            technologies: ["Python", "PyTorch", "CNN", "Image Classification"],
            isSecret: false,
            isGitHub: true,
        },
    ];

    return (
        <section className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <motion.div 
                className="text-center mb-12 relative z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
                    <Rocket className="w-12 h-12 text-blue-400" />
                    {t.projects.title}
                </h2>
                <p className="text-xl text-slate-300 mb-2 font-semibold">
                    {t.projects.subtitle}
                </p>
                <p className="text-sm text-slate-400 font-mono">
                    {t.projects.description}
                </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className="group relative rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                            boxShadow: '0 0 30px rgba(59, 130, 246, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.3)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                            }}
                        />
                        
                        <div className="relative overflow-hidden">
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                        
                        <div className="p-6 relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                                {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="bg-slate-800/50 text-slate-300 text-xs px-3 py-1 rounded-full font-medium border border-slate-700/50 backdrop-blur-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                {!project.isSecret && project.demoLink !== "" && (
                                    <motion.a
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {t.projects.viewDemo}
                                    </motion.a>
                                )}
                                {project.isGitHub && project.githubLink !== "" && (
                                    <motion.a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-slate-800/80 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-all duration-300 border border-slate-700/50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.903-.015 3.297 0 .322.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        {t.projects.viewCode}
                                    </motion.a>
                                )}
                                {project.isSecret && (
                                    <span className="flex items-center gap-2 bg-slate-800/50 text-slate-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed border border-slate-700/50">
                                        <Lock className="w-4 h-4" />
                                        {t.projects.confidential}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;
