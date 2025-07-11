"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

import { Wrench } from "lucide-react";

import { GB, HK, CN, JP, FR } from "country-flag-icons/react/3x2";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface Skill {
    name: string;
    icon?: string;
    color?: string;
    image?: string;
    description?: string;
    flag?: string;
}

interface SkillCarouselProps {
    category: string;
    skills: Skill[];
}

const SkillCarousel = ({ category, skills }: SkillCarouselProps) => {
    const [mounted, setMounted] = useState(false);

    // Create a safe selector ID from category name
    const getSafeSelector = (category: string) => {
        return category
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-") // Replace any non-alphanumeric with dash
            .replace(/-+/g, "-") // Replace multiple dashes with single dash
            .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
    };

    const selectorId = getSafeSelector(category);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render the swiper until after hydration
    if (!mounted) {
        return (
            <div className="mb-16">
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent text-center mb-8">
                    {category}
                </h3>
                <div className="flex flex-wrap justify-center gap-4 relative">
                    <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>

                    {skills.slice(0, 4).map((skill, index) => (
                        <div
                            key={`${category}-${skill.name}-${index}`}
                            className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-4 border border-slate-200 h-[200px] w-[200px] max-w-[200px] mx-auto flex flex-col items-center justify-between"
                        >
                            <div className="relative flex items-center justify-center w-16 h-16 mt-2">
                                {skill.image ? (
                                    <Image
                                        src={skill.image}
                                        alt={skill.name}
                                        width={64}
                                        height={64}
                                        className="rounded-lg object-contain"
                                    />
                                ) : (
                                    <i
                                        className={`${skill.icon} ${skill.color} text-4xl`}
                                    ></i>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center flex-1 px-2">
                                <h4 className="text-base font-bold text-gray-800 text-center mb-1 leading-tight">
                                    {skill.name}
                                </h4>

                                <div className="h-8 flex items-center justify-center">
                                    {skill.description && (
                                        <p className="text-xs text-gray-600 text-center opacity-70 leading-tight">
                                            {skill.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-16">
            <h3 className="text-3xl font-semibold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent text-center mb-8">
                {category}
            </h3>

            <div className="relative flex items-center min-h-[250px]">
                <button
                    className={`swiper-button-prev-${selectorId} absolute left-0 z-20 w-10 h-10 bg-gradient-to-r from-slate-600 to-blue-700 text-white rounded-full shadow-lg hover:from-slate-700 hover:to-blue-800 focus:outline-none transition-all duration-300 transform hover:scale-110 flex items-center justify-center -ml-5`}
                    aria-label={`Previous ${category} skill`}
                    style={{ pointerEvents: "auto" }}
                >
                    <i className="fas fa-chevron-left text-sm"></i>
                </button>

                <div className="flex-1 mx-4 overflow-hidden relative">
                    <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none"></div>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                        }}
                        navigation={{
                            nextEl: `.swiper-button-next-${selectorId}`,
                            prevEl: `.swiper-button-prev-${selectorId}`,
                        }}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={skills.length >= 1}
                        centeredSlides={false}
                        grabCursor={true}
                        className="skill-swiper !h-auto"
                        style={{ height: "auto", minHeight: "200px" }}
                    >
                        {skills.map((skill, index) => (
                            <SwiperSlide
                                key={`${category}-${skill.name}-${index}`}
                                className="h-auto"
                            >
                                <div className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-4 border border-slate-200 hover:border-blue-300 h-[200px] w-full mx-auto flex flex-col items-center justify-between">
                                    <div className="relative flex items-center justify-center w-16 h-16 mt-2">
                                        {skill.image ? (
                                            <Image
                                                src={skill.image}
                                                alt={skill.name}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : skill.icon ? (
                                            <i
                                                className={`${skill.icon} ${skill.color} text-4xl transition-transform duration-300 group-hover:scale-110`}
                                            ></i>
                                        ) : skill.flag ? (
                                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow border border-gray-200 overflow-hidden transition-transform duration-300 group-hover:scale-110">
                                                {skill.flag === "GB" ? (
                                                    <GB className="w-8 h-8 drop-shadow-md" />
                                                ) : skill.flag === "HK" ? (
                                                    <HK className="w-8 h-8 drop-shadow-md" />
                                                ) : skill.flag === "CN" ? (
                                                    <CN className="w-8 h-8 drop-shadow-md" />
                                                ) : skill.flag === "JP" ? (
                                                    <JP className="w-8 h-8 drop-shadow-md" />
                                                ) : skill.flag === "FR" ? (
                                                    <FR className="w-8 h-8 drop-shadow-md" />
                                                ) : null}
                                            </span>
                                        ) : null}

                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center flex-1 px-2">
                                        <h4 className="text-base font-bold text-gray-800 text-center mb-1 group-hover:text-purple-600 transition-colors duration-300 leading-tight">
                                            {skill.name}
                                        </h4>

                                        <div className="h-8 flex items-center justify-center">
                                            {skill.description && (
                                                <p className="text-xs text-gray-600 text-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                                                    {skill.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <button
                    className={`swiper-button-next-${selectorId} absolute right-0 z-10 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none transition-all duration-300 transform hover:scale-110 flex items-center justify-center -mr-5`}
                    aria-label={`Next ${category} skill`}
                >
                    <i className="fas fa-chevron-right text-sm"></i>
                </button>
            </div>
        </div>
    );
};

const SkillsSection = () => {
    const categorizedSkills = {
        "Programming Languages": [
            {
                name: "Python",
                icon: "fab fa-python",
                color: "text-blue-600",
                description: "Backend & Data Science",
                image: "/skills/programming/Python.png",
            },
            {
                name: "JavaScript",
                icon: "fab fa-js-square",
                color: "text-yellow-500",
                description: "Full-stack Development",
                image: "/skills/programming/JavaScript.png",
            },
            {
                name: "TypeScript",
                icon: "fab fa-js-square",
                color: "text-blue-600",
                description: "Type-safe JavaScript",
                image: "/skills/programming/TypeScript.png",
            },
            {
                name: "SQL",
                icon: "fas fa-database",
                color: "text-indigo-800",
                description: "Database Management",
            },
            {
                name: "R",
                icon: "fab fa-r-project",
                color: "text-blue-700",
                description: "Statistical Computing",
            },
            {
                name: "Bash",
                icon: "fas fa-terminal",
                color: "text-gray-700",
                description: "Shell Scripting",
            },
            {
                name: "HTML5",
                icon: "fab fa-html5",
                color: "text-orange-500",
                description: "Web Structure",
            },
            {
                name: "CSS3",
                icon: "fab fa-css3-alt",
                color: "text-blue-500",
                description: "Web Styling",
            },
        ],
        "Web Development": [
            {
                name: "React.js",
                icon: "fab fa-react",
                color: "text-blue-400",
                description: "Frontend Library",
            },
            {
                name: "Next.js",
                icon: "fas fa-arrow-right",
                color: "text-gray-900",
                description: "React Framework",
                image: "/skills/frameworks/NextJs.png",
            },
            {
                name: "Node.js",
                icon: "fab fa-node-js",
                color: "text-green-600",
                description: "Backend Runtime",
            },
            {
                name: "Express.js",
                icon: "fas fa-server",
                color: "text-gray-600",
                description: "Web Framework",
            },
            {
                name: "Tailwind CSS",
                icon: "fas fa-wind",
                color: "text-teal-500",
                description: "Utility-first CSS",
                image: "/skills/css/TailwindCSS.png",
            },
            {
                name: "REST APIs",
                icon: "fas fa-exchange-alt",
                color: "text-orange-500",
                description: "API Development",
            },
            {
                name: "GraphQL",
                icon: "fas fa-project-diagram",
                color: "text-pink-500",
                description: "Query Language",
            },
        ],
        "Cloud Platforms": [
            {
                name: "AWS",
                icon: "fab fa-aws",
                color: "text-orange-400",
                description: "Amazon Web Services",
                image: "/skills/cloud/AWS.png",
            },
            {
                name: "Azure",
                icon: "fas fa-cloud",
                color: "text-blue-700",
                description: "Microsoft Cloud",
                image: "/skills/cloud/Azure.png",
            },
            {
                name: "GCP",
                icon: "fas fa-cloud-meatball",
                color: "text-red-500",
                description: "Google Cloud Platform",
                image: "/skills/cloud/GCP.png",
            },
            {
                name: "Alibaba Cloud",
                icon: "fas fa-cloud-upload-alt",
                color: "text-orange-600",
                description: "Chinese Cloud Provider",
                image: "/skills/cloud/AlibabaCloud.png",
            },
            {
                name: "Vercel",
                icon: "fas fa-bolt",
                color: "text-black",
                description: "Frontend Deployment",
                image: "/skills/cloud/Vercel.png",
            },
            {
                name: "Netlify",
                icon: "fas fa-globe",
                color: "text-teal-500",
                description: "JAMstack Platform",
                image: "/skills/cloud/Netlify.png",
            },
        ],
        "DevOps & Infrastructure": [
            {
                name: "Docker",
                icon: "fab fa-docker",
                color: "text-blue-500",
                description: "Containerization",
            },
            {
                name: "Kubernetes",
                icon: "fas fa-dharmachakra",
                color: "text-blue-600",
                description: "Container Orchestration",
            },
            {
                name: "Terraform",
                icon: "fas fa-server",
                color: "text-purple-600",
                description: "Infrastructure as Code",
                image: "/skills/devops/Terraform.png",
            },
            {
                name: "Ansible",
                icon: "fas fa-robot",
                color: "text-red-600",
                description: "Configuration Management",
                image: "/skills/devops/Ansible.png",
            },
            {
                name: "GitHub Actions",
                icon: "fab fa-github-alt",
                color: "text-blue-800",
                description: "GitHub CI/CD",
                image: "/skills/devops/GitHubActions.png",
            },
            {
                name: "Nginx",
                icon: "fas fa-globe",
                color: "text-green-700",
                description: "Web Server",
                image: "/skills/devops/Nginx.png",
            },
        ],
        "AI & Data Integration": [
            {
                name: "Machine Learning",
                icon: "fas fa-brain",
                color: "text-purple-500",
                description: "ML Algorithms",
            },
            {
                name: "Deep Learning",
                icon: "fas fa-network-wired",
                color: "text-purple-700",
                description: "Neural Networks",
            },
            {
                name: "LLM APIs",
                icon: "fas fa-robot",
                color: "text-indigo-600",
                description: "Large Language Models",
            },
            {
                name: "Data Analysis",
                icon: "fas fa-chart-bar",
                color: "text-blue-500",
                description: "Statistical Analysis",
            },
            {
                name: "Time Series",
                icon: "fas fa-chart-line",
                color: "text-teal-500",
                description: "Temporal Data Analysis",
            },
            {
                name: "Pandas",
                icon: "fas fa-table",
                color: "text-green-600",
                description: "Data Manipulation",
                image: "/skills/data/Pandas.png",
            },
            {
                name: "NumPy",
                icon: "fas fa-calculator",
                color: "text-blue-700",
                description: "Numerical Computing",
                image: "/skills/data/NumPy.png",
            },
            {
                name: "TensorFlow",
                icon: "fas fa-brain",
                color: "text-orange-500",
                description: "ML Framework",
                image: "/skills/data/TensorFlow.png",
            },
            {
                name: "PyTorch",
                icon: "fab fa-python",
                color: "text-red-600",
                description: "Deep Learning Framework",
                image: "/skills/data/PyTorch.png",
            },
            {
                name: "Scikit-learn",
                icon: "fas fa-cogs",
                color: "text-yellow-500",
                description: "ML Library",
                image: "/skills/data/ScikitLearn.png",
            },
            {
                name: "Matplotlib",
                icon: "fas fa-chart-bar",
                color: "text-blue-600",
                description: "Plotting Library",
                image: "/skills/data/Matplotlib.png",
            },
            {
                name: "Seaborn",
                icon: "fas fa-palette",
                color: "text-purple-500",
                description: "Statistical Data Visualization",
                image: "/skills/data/Seaborn.png",
            },
            {
                name: "Plotly",
                icon: "fas fa-chart-line",
                color: "text-orange-600",
                description: "Interactive Graphs",
                image: "/skills/data/Plotly.png",
            },
        ],
        "Tools & Technologies": [
            {
                name: "Git & GitHub",
                icon: "fab fa-github",
                color: "text-gray-700",
                description: "Version Control",
            },
            {
                name: "VS Code",
                icon: "fas fa-code",
                color: "text-blue-600",
                description: "Code Editor",
                image: "/skills/tools/VSCode.png",
            },
            {
                name: "Linux",
                icon: "fab fa-linux",
                color: "text-black",
                description: "Exposure to various distros and Linux/GNU",
                image: "/skills/tools/Linux.png",
            },
            {
                name: "Postman",
                icon: "fas fa-paper-plane",
                color: "text-orange-500",
                description: "API Testing",
                image: "/skills/tools/Postman.png",
            },
            {
                name: "Figma",
                icon: "fab fa-figma",
                color: "text-purple-500",
                description: "UI/UX Design",
            },
            {
                name: "MongoDB",
                icon: "fas fa-leaf",
                color: "text-green-600",
                description: "NoSQL Database",
                image: "/skills/databases/MongoDB.png",
            },
            {
                name: "PostgreSQL",
                icon: "fas fa-elephant",
                color: "text-blue-700",
                description: "SQL Database",
                image: "/skills/databases/Postgresql.png",
            },
            {
                name: "Basic Networking",
                icon: "fas fa-network-wired",
                color: "text-gray-500",
                description: "Networking protocols and concepts",
            },
            {
                name: "Basic Ethnical Hacking",
                icon: "fas fa-user-secret",
                color: "text-black-500",
                description: "Knowledge of security principles and practices",
            },
        ],
        "Languages": [
            {
                name: "English",
                description: "Fluent in English",
                flag: "GB",
            },
            {
                name: "Cantonese",
                description: "Fluent in Cantonese",
                flag: "HK",
            },
            {
                name: "Mandarin",
                description: "Fluent in Mandarin",
                flag: "CN",
            },
            {
                name: "Japanese",
                description: "Self-study a bit in Japanese",
                flag: "JP",
            },
            {
                name: "French",
                description:
                    "Taken A1 courses in Alliance Française de Hong Kong",
                flag: "FR",
            },
        ],
        "Soft Skills": [
            {
                name: "Problem Solving",
                icon: "fas fa-lightbulb",
                color: "text-yellow-500",
                description: "Analytical thinking and creativity",
            },
            {
                name: "Communication",
                icon: "fas fa-comments",
                color: "text-blue-500",
                description: "Effective verbal and written communication",
            },
            {
                name: "Teamwork",
                icon: "fas fa-users",
                color: "text-green-500",
                description: "Collaboration in diverse teams",
            },
            {
                name: "Adaptability",
                icon: "fas fa-sync-alt",
                color: "text-purple-500",
                description: "Flexibility in dynamic environments",
            },
            {
                name: "Time Management",
                icon: "fas fa-clock",
                color: "text-red-500",
                description: "Prioritizing tasks effectively",
            },
        ],
    };

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-2xl shadow-2xl mb-8 animate-fadeIn border border-slate-300">
            <h2 className="text-4xl font-extrabold text-center mb-12 flex items-center justify-center gap-3 bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                <span>My Skills</span>
                <span className="inline-flex items-center justify-center">
                    <Wrench className="w-9 h-9 text-blue-600 drop-shadow-md" />
                </span>
            </h2>
            <div className="max-w-6xl mx-auto">
                {Object.entries(categorizedSkills).map(([category, skills]) => (
                    <SkillCarousel
                        key={category}
                        category={category}
                        skills={skills}
                    />
                ))}
            </div>
        </section>
    );
};

export default SkillsSection;
