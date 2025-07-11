"use client";

import { useState, useEffect, useRef } from "react";

interface HeaderProps {
    navigate: (page: string) => void;
    currentPage: string;
    className?: string;
}

const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Hong Kong", id: "hongkong" },
    { name: "Hobbies", id: "hobbies" },
    { name: "Contact", id: "contact" },
];

const Header = ({ navigate, currentPage, className }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <header className={`bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-700 shadow-xl py-4 px-6 sticky top-0 z-50 rounded-b-2xl backdrop-blur-lg bg-opacity-90 ${className || ''}`}>
            <nav className="container mx-auto flex justify-between items-center relative rounded-xl bg-opacity-10 px-4 py-2">
                <button
                    className="text-2xl font-bold text-white hover:text-blue-300 transition-colors duration-300 cursor-pointer drop-shadow-lg bg-transparent border-none"
                    onClick={() => navigate("home")}
                    aria-label="Go to Home"
                >
                    Simon Cheung Tak Leung
                </button>
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen((open) => !open)}
                        className="text-white hover:text-blue-300 focus:outline-none"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <ul
                    ref={menuRef}
                    id="mobile-menu"
                    className={`transition-all duration-300 md:flex md:items-center md:space-x-6 flex-col md:flex-row
                        ${
                            isOpen
                                ? "flex opacity-100 pointer-events-auto"
                                : "hidden opacity-0 pointer-events-none"
                        }
                        py-4 md:flex md:opacity-100 md:pointer-events-auto absolute md:static bg-gradient-to-r from-slate-700 to-blue-600 md:bg-transparent w-11/12 md:w-auto left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 mt-2 md:mt-0 py-4 md:py-0 shadow-2xl md:shadow-none rounded-2xl md:rounded-xl backdrop-blur-lg z-40`}
                >
                    {navItems.map((item) => {
                        return (
                            <li
                                key={item.id}
                                className={`w-full md:w-auto`}
                            >
                                <button
                                    onClick={() => {
                                        navigate(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full md:w-auto text-left md:text-center block px-6 py-3 md:px-4 md:py-2 text-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none
                                        ${
                                            currentPage === item.id
                                                ? "text-blue-300 bg-white bg-opacity-20 md:bg-transparent shadow-lg"
                                                : "text-white hover:text-blue-300 hover:bg-white md:hover:bg-transparent"
                                        }
                                        rounded-xl
                                    `}
                                    aria-current={currentPage === item.id ? "page" : undefined}
                                >
                                    {item.name}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
