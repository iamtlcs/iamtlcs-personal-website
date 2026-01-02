'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HK } from 'country-flag-icons/react/3x2';
import { useLanguage } from '@/contexts/LanguageContext';
import { interpolate } from '@/lib/i18n';
import React from 'react';

const HongKongSection = () => {
  const { t } = useLanguage();
  return (
    <section className="min-h-screen py-16 px-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <motion.div 
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-2">
            {t.hongkong.title}
          </h2>
          <HK className="w-16 h-16 drop-shadow-lg" />
        </div>
        <p className="text-xl text-slate-300 mb-2 font-semibold">
          {t.hongkong.subtitle}
        </p>
        <p className="text-sm text-slate-400 font-mono">
          {t.hongkong.description}
        </p>
      </motion.div>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
        <motion.div 
          className="md:w-1/2 text-lg leading-relaxed rounded-2xl backdrop-blur-sm p-8 border border-slate-700/50"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.3)'
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="mb-6 text-slate-300">
            {interpolate(t.hongkong.paragraph1, { hongKong: <span key="hk" className="font-semibold text-blue-400">{t.hongkong.hongKong}</span> }).map((part, i) => (
              <React.Fragment key={i}>{part}</React.Fragment>
            ))}
          </p>
          <p className="mb-6 text-slate-300">
            {t.hongkong.paragraph2}
          </p>
          <p className="text-slate-300">
            {t.hongkong.paragraph3}
          </p>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full max-w-lg rounded-2xl backdrop-blur-sm p-4 border border-slate-700/50"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <HongKongSlideshow />
          </div>
        </motion.div>
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
      <div className="relative w-full h-[400px] flex items-center justify-center group">
        <motion.button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-full shadow-lg p-2 transition-all duration-150 border border-slate-700/50 backdrop-blur-sm"
          aria-label="Previous image"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="sr-only">Previous</span>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
        </motion.button>
        <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-700/50 shadow-2xl">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={hongKongImages[current]}
              alt={`Hong Kong Slide ${current + 1}`}
              width={500}
              height={400}
              className="rounded-2xl w-full max-w-md object-cover"
              priority
            />
          </motion.div>
        </div>
        <motion.button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-full shadow-lg p-2 transition-all duration-150 border border-slate-700/50 backdrop-blur-sm"
          aria-label="Next image"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="sr-only">Next</span>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' /></svg>
        </motion.button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {hongKongImages.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`inline-block w-3 h-3 rounded-full border transition-all duration-200 ${
                idx === current 
                  ? 'bg-blue-500 border-blue-400 scale-150 shadow-lg shadow-blue-500/50' 
                  : 'bg-slate-600 border-slate-500 hover:bg-slate-500'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center w-full mt-4">
        <span className="text-sm text-slate-400 font-bold bg-slate-800/50 px-5 py-2 rounded-xl shadow-lg border border-slate-700/50 tracking-widest uppercase backdrop-blur-sm">
          {current + 1} / {total}
        </span>
      </div>
    </div>
  );
}

export default HongKongSection;
