import Image from "next/image";

import { Rocket } from "lucide-react";

const ProjectsSection = () => {
    const projects = [
        {
            title: "This Website",
            description:
                "Personal portfolio built with Next.js, React, and Tailwind CSS. Showcases my projects, experience, and skills with a modern, responsive design.",
            image: "/projects/FrontendDev.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/iamtlcs-personal-website",
            technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
            isSecret: false,
            isGitHub: true,
        },
        {
            title: "AWS Terraform IaC URL Shortener",
            description:
                "Infrastructure-as-Code project deploying a scalable URL shortener on AWS using Terraform. Automated provisioning of Lambda, API Gateway, DynamoDB, and monitoring.",
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
            title: "Terraform IaC ECS Load Balancer with Blue-Green Deployment",
            description:
                "Automated deployment of containerized applications on AWS ECS with blue-green deployment strategy using Terraform. Includes ALB, ECS, CodeDeploy, and CI/CD integration.",
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
            title: "State Machine Concurrency Control Data Processing Units",
            description:
                "Designed and implemented scalable data processing pipelines with concurrency control using AWS Step Functions and Lambda. (Job-related project: Details are confidential, but maybe there will be a Medium article to go through what I did!)",
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
            title: "Algorithmic Trading Competition",
            description:
                "Developed and backtested a MACD-based trading algorithm for BTC-USDT perpetual futures. Received first runner-up in a global competition.",
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
            title: "Self-research on Algorithmic Trading",
            description:
                "Conducted self-directed research on algorithmic trading strategies, focusing on technical indicators, statistical arbitrage, and statistical models. To be organised to show you guys!",
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
            title: "Art Classification with CNN",
            description:
                "Built a Convolutional Neural Network (CNN) to classify which painting belongs to which artist.",
            image: "/projects/ArtClassification.png",
            demoLink: "",
            githubLink: "https://github.com/iamtlcs/image-classification",
            technologies: ["Python", "PyTorch", "CNN", "Image Classification"],
            isSecret: false,
            isGitHub: true,
        },
    ];

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-2xl shadow-2xl mb-8 animate-fadeIn border border-slate-300">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-14 tracking-tight drop-shadow-lg flex items-center justify-center gap-3">
                <span>My Projects</span>
                <span className="relative">
                    <Rocket className="inline-block w-9 h-9 text-blue-600 drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]" />
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-slideInFromBottom border border-slate-200 hover:border-blue-300 hover:shadow-2xl"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-3">
                                {project.title}
                            </h3>
                            <p className="text-gray-800 mb-4">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700 text-sm px-3 py-1 rounded-full font-medium border border-slate-200"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {!project.isSecret &&
                                    project.demoLink !== "" && (
                                        <a
                                            href={project.demoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-md"
                                        >
                                            <span
                                                role="img"
                                                aria-label="Live Demo"
                                            >
                                                ✨
                                            </span>
                                            Live Demo
                                        </a>
                                    )}
                                {project.isGitHub &&
                                    project.githubLink !== "" && (
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-slate-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-md"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.604-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.903-.015 3.297 0 .322.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                                            </svg>
                                            GitHub
                                        </a>
                                    )}
                                {project.isSecret && (
                                    <span className="flex items-center gap-2 bg-gradient-to-r from-slate-200 to-gray-300 text-slate-600 px-4 py-2 rounded-full text-sm font-semibold cursor-not-allowed shadow-inner">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M6.2 6.2A9.956 9.956 0 012 9c0 5.523 4.477 10 10 10 1.657 0 3.22-.403 4.575-1.125M17.8 17.8A9.956 9.956 0 0022 15c0-5.523-4.477-10-10-10-1.657 0-3.22.403-4.575 1.125"
                                            />
                                            <line
                                                x1="3"
                                                y1="3"
                                                x2="21"
                                                y2="21"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                        Confidential
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;
