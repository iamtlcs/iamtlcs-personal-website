"use client";

import { Mail } from "lucide-react";
import { useState, useEffect } from "react";

const ContactSection = () => {
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
        <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-2xl shadow-2xl mb-8 animate-fadeIn border border-slate-300">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-12 flex items-center justify-center gap-3">
                Get In Touch
                <span className="flex items-center">
                    <Mail
                        className="w-8 h-8 text-blue-600 drop-shadow-md"
                        aria-label="Mail Icon"
                    />
                </span>
            </h2>
            <div className="max-w-2xl mx-auto text-center text-lg leading-relaxed text-gray-800">
                <p className="mb-8">
                    I&apos;m always open to new opportunities and
                    collaborations. Feel free to reach out if you have any
                    questions, want to discuss a project, or just say hello!
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={handleDownloadCV}
                        className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center justify-center hover:shadow-emerald-500/25"
                    >
                        <i className="fas fa-download mr-2"></i> Download CV
                    </button>
                    <a
                        href="mailto:simoncheung2002@gmail.com"
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-110 shadow-2xl flex items-center justify-center hover:shadow-blue-500/25"
                    >
                        <i className="fas fa-envelope mr-2"></i> Email Me
                    </a>
                </div>
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-slate-700 to-blue-600 bg-clip-text text-transparent mb-4">
                        Connect with me:
                    </h3>
                    <div className="flex justify-center space-x-6">
                        <a
                            href="https://github.com/iamtlcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 transform hover:scale-125"
                        >
                            <i className="fab fa-github text-4xl"></i>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/iamtlcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 transform hover:scale-125"
                        >
                            <i className="fab fa-linkedin text-4xl"></i>
                        </a>
                        <a
                            href="https://discord.com/users/tahithchongluton"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 transform hover:scale-125"
                        >
                            <i className="fab fa-discord text-4xl"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
