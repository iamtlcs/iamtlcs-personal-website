import Image from 'next/image';
import { useState } from 'react';
import { HK } from 'country-flag-icons/react/3x2';

const HongKongSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-white via-slate-50 to-gray-100 rounded-3xl shadow-2xl mb-12 animate-fadeIn border border-slate-300">
      <div className="flex flex-col items-center pb-5 mb-10">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-slate-700 via-gray-600 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            My Hong Kong Roots
          </h2>
          <HK className="w-12 h-12 drop-shadow-lg" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0 text-lg leading-relaxed text-gray-800 bg-white/80 rounded-xl shadow-lg p-8 border border-slate-200">
            <p className="mb-6">
            Growing up in the heart of{" "}
            <span className="font-semibold text-blue-600">
              Hong Kong
            </span>
            , I was immersed in a city where efficiency and reliability are essential for daily life. The fast-paced environment and robust urban infrastructure have shaped my mindset toward building systems that are dependable, scalable, and high-performing.
            </p>
            <p className="mb-6">
            Navigating complex transport networks and witnessing seamless city operations taught me the value of well-architected backends and resilient infrastructure. These experiences drive my engineering approach—prioritizing efficiency, fault tolerance, and maintainability in every solution I design.
            </p>
            <p>
            The iconic skyline, advanced public systems, and dynamic city life continue to inspire my focus on robust architecture and operational excellence. I strive to bring this spirit of efficiency and reliability into every backend, system, and infrastructure project I develop.
            </p>
        </div>
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="w-full max-w-lg bg-white/90 rounded-xl shadow-xl p-4 border border-slate-200 flex flex-col items-center">
            <HongKongSlideshow />
          </div>
        </div>
      </div>
    </section>
  );
}

// Slideshow component for Hong Kong images
const hongKongImages = [
  '/hongkong/Building1.png',
  '/hongkong/NeonLight1.png',
  '/hongkong/NightView1.png',
  '/hongkong/OldStreet1.png',
  '/hongkong/Tram1.png',
];

function HongKongSlideshow() {
  const [current, setCurrent] = useState(0);
  const total = hongKongImages.length;
  const next = () => setCurrent((c) => (c + 1) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  return (
    <div className="relative w-full max-w-md flex flex-col items-center">
      <div className="relative w-full h-[350px] flex items-center justify-center group">
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-slate-50 text-gray-700 hover:text-blue-600 text-3xl rounded-full shadow p-1 transition-all duration-150 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Previous image"
        >
          <span className="sr-only">Previous</span>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
        </button>
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 border-4 border-slate-300 shadow-2xl">
          <Image
            src={hongKongImages[current]}
            alt={`Hong Kong Slide ${current + 1}`}
            width={500}
            height={350}
            className="rounded-3xl w-full max-w-md object-cover transition-transform duration-500 drop-shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            priority
          />
        </div>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-slate-50 text-gray-700 hover:text-blue-600 text-3xl rounded-full shadow p-1 transition-all duration-150 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Next image"
        >
          <span className="sr-only">Next</span>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' /></svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {hongKongImages.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-3 h-3 rounded-full border border-blue-400 transition-all duration-200 ${idx === current ? 'bg-blue-400 scale-150 shadow-xl' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center w-full mt-4">
        <span className="text-base text-slate-700 font-bold bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 px-5 py-2 rounded-2xl shadow-lg border-2 border-slate-300 tracking-widest uppercase animate-pulse">{current + 1} / {total}</span>
      </div>
    </div>
  );
}

export default HongKongSection;
