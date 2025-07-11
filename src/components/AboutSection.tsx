import { Sparkles } from "lucide-react";

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
        link: "",
        credId: "",
        inProgress: true,
    },
];

const AboutSection = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-3xl shadow-2xl mb-12 border border-slate-300 max-w-5xl mx-auto animate-fadeIn">
            <h2 className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-16 drop-shadow-lg tracking-tight">
                About Me
                <span>
                    <Sparkles
                        className="w-10 h-10 text-blue-500 drop-shadow-md"
                        aria-label="Sparkles"
                    />
                </span>
            </h2>
            <div className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-800 space-y-7">
                <p>
                    Hello! I&apos;m a dedicated Full Stack and DevOps Engineer
                    with a passion for creating intuitive, dynamic, and scalable
                    web applications. My journey into web development began
                    during my time at{" "}
                    <span className="font-semibold text-blue-600">
                        The Chinese University of Hong Kong
                    </span>
                    , where I earned a Bachelor of Science in Statistics (August
                    2020 - July 2024) and honed my skills in various programming
                    languages and design principles.
                </p>
                <p>
                    I thrive on turning complex problems into elegant solutions
                    and love the challenge of bringing designs to life with
                    clean, efficient code. My expertise spans modern JavaScript
                    frameworks like{" "}
                    <span className="font-semibold text-indigo-600">React</span>,
                    backend technologies like{" "}
                    <span className="font-semibold text-slate-600">
                        Node.js and Python
                    </span>
                    , and cloud platforms such as{" "}
                    <span className="font-semibold text-blue-600">
                        AWS and Azure
                    </span>
                    , coupled with responsive design techniques and a keen eye
                    for user experience.
                </p>
                <p>
                    Beyond coding, I&apos;m constantly exploring new
                    technologies and design trends to keep my skills sharp and
                    my approach fresh. You can find more details about my
                    professional journey and connect with me on{" "}
                    <a
                        href="https://www.linkedin.com/in/iamtles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-indigo-600 hover:underline font-semibold transition-colors duration-300"
                    >
                        LinkedIn
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://github.com/iamtles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-indigo-600 hover:underline font-semibold transition-colors duration-300"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <p>
                    This website is a testament to my commitment to frontend
                    excellence, showcasing my ability to build engaging and
                    responsive user interfaces from scratch.
                </p>
            </div>
            <div className="mt-14">
                <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center tracking-tight flex items-center justify-center gap-2">
                    <span>Tech Certifications</span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {certifications.map((cert) => {
                        const isInProgress = cert.inProgress;
                        const badgeContent = (
                            <div className="flex flex-col items-center w-full h-full relative">
                                {/* Coming Soon Badge */}
                                {isInProgress && (
                                    <div className="absolute -top-2 -right-2 z-20">
                                        <div className="relative">
                                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 animate-pulse">
                                                COMING SOON
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 animate-ping opacity-20">
                                                COMING SOON
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                    <img
                                        src={cert.image}
                                        alt={cert.name}
                                        className={`w-full h-full p-3 object-contain bg-white rounded-xl shadow-lg transition-all duration-500
              ${
                  isInProgress
                      ? "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-105 group-hover:shadow-orange-200/60 group-hover:bg-orange-50"
                      : "group-hover:scale-105 group-hover:bg-slate-50 group-hover:shadow-blue-200/60"
              }
            `}
                                    />
                                    {!isInProgress && (
                                        <div className="absolute inset-0 z-10 pointer-events-none metallic-shine" />
                                    )}
                                </div>

                                <div className="flex flex-col items-center w-full px-2">
                                    <span
                                        className={`block text-xs font-mono font-semibold mt-1 tracking-tight whitespace-nowrap rounded px-2 py-1 mb-2 shadow-sm transition-colors duration-300
                                        ${
                                            isInProgress
                                                ? "text-orange-700 bg-orange-100 border border-orange-200"
                                                : "text-slate-600 bg-slate-100 border border-slate-200"
                                        }
                                    `}
                                    >
                                        {cert.code}
                                    </span>
                                    <span
                                        className={`block text-center text-sm font-bold transition-colors duration-300 whitespace-normal break-words leading-tight
                                          ${
                                              isInProgress
                                                  ? "text-orange-600 group-hover:text-orange-800"
                                                  : "text-slate-700 group-hover:text-blue-600"
                                          }
                                        `}
                                    >
                                        {cert.name}
                                    </span>
                                </div>
                            </div>
                        );

                        if (cert.link && !isInProgress) {
                            return (
                                <a
                                    key={cert.name}
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200 hover:border-blue-300 flex flex-col items-center p-6 min-h-[280px]"
                                    title={`${cert.name} (${cert.code}) - Click to verify`}
                                >
                                    {badgeContent}
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg
                                            className="w-4 h-4 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </div>
                                </a>
                            );
                        } else {
                            return (
                                <div
                                    key={cert.name}
                                    className="group relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 border border-orange-200 hover:border-orange-300 flex flex-col items-center p-6 min-h-[280px] transition-all duration-300"
                                    title={`${cert.name} (${cert.code}) - In Progress`}
                                >
                                    {badgeContent}
                                </div>
                            );
                        }
                    })}
                    <style>{`
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
          `}</style>
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-12 text-right pr-2">
                Last updated: July 2025
            </p>
            <style>{`
        .metallic-shine {
          background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0.7) 0%,
        rgba(255, 255, 255, 0.2) 40%,
        rgba(255, 255, 255, 0.7) 100%
          );
          opacity: 0.7;
          mix-blend-mode: lighten;
          animation: shine 2.5s infinite linear;
        }
        @keyframes shine {
          0% {
        transform: translateX(-100%) skewX(-20deg);
          }
          100% {
        transform: translateX(100%) skewX(-20deg);
          }
        }
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
        @keyframes spin {
          100% {
        transform: rotate(360deg);
          }
        }
      `}</style>
        </section>
    );
};

export default AboutSection;
