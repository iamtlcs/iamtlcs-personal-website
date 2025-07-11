import { Puzzle } from "lucide-react";

const HobbiesSection = () => {
    const hobbies = [
        {
            name: "Movies",
            icon: "fas fa-film",
            description:
                "Exploring the world of cinema, from classics to modern blockbusters.",
        },
        {
            name: "Football",
            icon: "fas fa-futbol",
            description:
                "Playing football and enjoying the camaraderie of team sports.",
        },
        {
            name: "Reading",
            icon: "fas fa-book-open",
            description: "Diving into non-fiction to expand my knowledge.",
        },
        {
            name: "Algo Trading",
            icon: "fas fa-chart-line",
            description:
                "Applying statistical analysis and programming to develop trading algorithms.",
        },
        {
            name: "Traveling",
            icon: "fas fa-plane",
            description:
                "Exploring new cultures and places, with a special fondness for Japan.",
        },
        {
            name: "Gaming",
            icon: "fas fa-gamepad",
            description:
                "Enjoying video games as a way to relax and challenge my strategic thinking.",
        },
        {
            name: "Coding",
            icon: "fas fa-code",
            description:
                "Building projects and experimenting with new technologies in my free time.",
      },
        
    ];

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-2xl shadow-2xl mb-8 animate-fadeIn border border-slate-300">
            <div className="flex flex-col items-center mb-14">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                            My Hobbies & Personality
                        </h2>
                        <span className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full p-2 shadow-lg flex items-center justify-center">
                            <Puzzle
                                className="w-9 h-9 text-white drop-shadow"
                                aria-label="Puzzle Icon"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto text-lg leading-relaxed text-gray-800 mb-12">
                <p className="text-center mb-8">
                    Beyond the code, I&apos;m a curious and creative individual
                    who loves to explore new things. As an{" "}
                    <span className="font-semibold text-blue-600">INTP</span>,
                    my personality is characterized by a strong drive for
                    logical analysis and innovative problem-solving. I enjoy
                    delving into complex systems and abstract concepts, which
                    fuels my passion for both coding and my diverse hobbies.
                </p>
                <p className="text-center">
                    Here are some of the activities that keep me inspired and
                    balanced:
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {hobbies.map((hobby, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 hover:rotate-1 transition-all duration-300 animate-bounceIn border border-slate-200 hover:border-blue-300"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <i
                            className={`${hobby.icon} text-transparent bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-5xl mb-4`}
                        ></i>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {hobby.name}
                        </h3>
                        <p className="text-center text-gray-700 text-base">
                            {hobby.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HobbiesSection;
