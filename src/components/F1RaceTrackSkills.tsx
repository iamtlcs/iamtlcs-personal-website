'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { ErrorBoundary } from 'react-error-boundary';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSectors, type Sector, type SkillWithIcon } from '@/lib/skills';
import SkillsTrack2D from './SkillsTrack2D';

const SkillsTrack3D = dynamic(() => import('./SkillsTrack3D'), {
  ssr: false,
  loading: () => <SkillsTrackLoading />,
});

interface SkillIconProps {
  skill: SkillWithIcon;
  size?: number;
  className?: string;
}

function SkillIcon({ skill, size = 40, className = "" }: SkillIconProps) {
  const [imageError, setImageError] = React.useState(false);
  const isFontAwesome = /^(fab|fas|far|fal)(:| fa-)/.test(skill.icon);

  // Container style for consistent sizing
  const containerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    margin: '4px',
    padding: '2px',
  };

  // If image failed to load, use Font Awesome icon as fallback
  if (imageError) {
    const faClass = skill.faIcon || getDefaultFAIcon(skill.name);
    return (
      <div style={containerStyle}>
        <i 
          className={`${faClass} text-slate-200`}
          style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
        />
      </div>
    );
  }

  // If it's a Font Awesome icon (not an image path), use it directly
  if (isFontAwesome) {
    let faClass: string;
    // Parse Font Awesome format: "fab:react" -> "fab fa-react"
    const match = skill.icon.match(/^(fab|fas|far|fal):(.+)$/);
    if (match) {
      const [, prefix, iconName] = match;
      faClass = `${prefix} fa-${iconName}`;
    } else {
      faClass = skill.icon; // Already a valid FA class
    }
    
    return (
      <div style={containerStyle}>
        <i 
          className={`${faClass} text-slate-200`}
          style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
        />
      </div>
    );
  }

  // Priority: Try to load image first (if it's an image path)
  // Image paths typically start with '/' or are relative paths
  if (skill.icon.startsWith('/') || skill.icon.includes('.')) {
    return (
      <div style={containerStyle}>
        <Image 
          src={skill.icon} 
          alt={skill.name}
          width={size}
          height={size}
          className={`object-contain ${className}`}
          style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Final fallback: use Font Awesome icon
  const faClass = skill.faIcon || getDefaultFAIcon(skill.name);
  return (
    <div style={containerStyle}>
      <i 
        className={`${faClass} text-slate-200`}
        style={{ fontSize: `${size * 0.75}px`, lineHeight: 1 }}
      />
    </div>
  );
}

// Helper function to get default Font Awesome icons for common skills
function getDefaultFAIcon(skillName: string): string {
  const iconMap: Record<string, string> = {
    'Python': 'fab fa-python',
    'JavaScript': 'fab fa-js-square',
    'TypeScript': 'fab fa-js-square',
    'Go': 'fab fa-golang',
    'Node.js': 'fab fa-node-js',
    'React.js': 'fab fa-react',
    'Next.js': 'fas fa-arrow-right',
    'Express.js': 'fas fa-server',
    'Tailwind CSS': 'fas fa-wind',
    'MERN Stack': 'fab fa-react',
    'AWS': 'fab fa-aws',
    'Azure': 'fas fa-cloud',
    'GCP': 'fas fa-cloud-meatball',
    'Alibaba Cloud': 'fas fa-cloud-upload-alt',
    'Kubernetes': 'fas fa-dharmachakra',
    'Docker': 'fab fa-docker',
    'Terraform': 'fas fa-server',
    'Ansible': 'fas fa-robot',
    'GitHub Actions': 'fab fa-github-alt',
    'Argo CD': 'fas fa-ship',
    'Prometheus': 'fas fa-chart-line',
    'Grafana': 'fas fa-chart-bar',
    'Loki & Mimir': 'fas fa-database',
    'OTel': 'fas fa-project-diagram',
    'PostgreSQL': 'fas fa-elephant',
    'MongoDB': 'fas fa-leaf',
    'LLM APIs': 'fas fa-robot',
    'Hugging Face': 'fas fa-hands-helping',
    'PyTorch': 'fab fa-python',
    'TensorFlow': 'fas fa-brain',
    'Pandas': 'fas fa-table',
    'Penetration Testing': 'fas fa-user-secret',
    'SIEM': 'fas fa-shield-alt',
    'Incident Response': 'fas fa-exclamation-triangle',
    'Digital Forensics': 'fas fa-search',
  };

  return iconMap[skillName] || 'fas fa-code';
}

function SkillsTrackLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 text-center" role="status">
      <Gauge className="h-12 w-12 text-blue-700 dark:text-blue-400" aria-hidden="true" />
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {t.skills.graphicsLoading}
      </p>
    </div>
  );
}

export default function F1RaceTrackSkills() {
  const { t } = useLanguage();
  const sectors = useMemo(() => getSectors(t), [t]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery('(max-width: 767px)');
  const lowPower = compact || reducedMotion;
  const webGLSupported = useWebGLSupport();
  const [rendererFailed, setRendererFailed] = useState(false);
  const [viewMode, setViewMode] = useState<'auto' | '2d' | '3d'>('auto');
  const canRender3D = webGLSupported === true && !rendererFailed;
  const showTrack = canRender3D && viewMode !== '2d';
  const handleRendererFailure = useCallback(() => setRendererFailed(true), []);
  const trackRef = useRef<HTMLDivElement>(null);
  const [sceneActive, setSceneActive] = useState(true);

  useEffect(() => {
    // Font Awesome is only used by skill fallbacks; never block the homepage on it.
    if (document.getElementById('skill-icon-font')) return;
    const stylesheet = document.createElement('link');
    stylesheet.id = 'skill-icon-font';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(stylesheet);
  }, []);

  useEffect(() => {
    let inView = true;
    const update = () => setSceneActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    if (trackRef.current) observer.observe(trackRef.current);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector);
    setIsPaused(true);
  };

  const handleClose = () => {
    setSelectedSector(null);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!selectedSector) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const closeButton = document.querySelector<HTMLButtonElement>('[aria-label="Close skill details"]');
    closeButton?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector('[aria-labelledby="skill-dialog-title"]');
      const controls = dialog?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedSector]);

  // Add keyboard support for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSector) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSector]);

  return (
      <section className="content-section min-h-[70dvh] py-10 sm:py-16 px-4 sm:px-6 relative">
          <motion.div
              className="text-center mb-8 relative z-10"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
          >
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-700 via-amber-700 to-blue-700 dark:from-red-400 dark:via-yellow-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3">
                  <Gauge className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 text-yellow-400" />
                  {t.skills.title}
              </h2>
              <p className="text-base sm:text-xl theme-muted mb-2 font-semibold">
                  {t.skills.subtitle}
              </p>
              <p className="text-sm theme-muted font-mono">
                  {showTrack ? t.skills.instructions : t.skills.twoDInstructions}
              </p>
              <div className="mt-5 flex justify-center gap-2" role="group" aria-label={t.skills.viewMode}>
                  <button
                      type="button"
                      className="track-view-button theme-control min-h-11 rounded-lg border px-5 py-2 text-sm font-semibold"
                      aria-pressed={!showTrack}
                      onClick={() => setViewMode('2d')}
                  >2D</button>
                  <button
                      type="button"
                      className="track-view-button theme-control min-h-11 rounded-lg border px-5 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      aria-pressed={showTrack}
                      disabled={!canRender3D}
                      title={!canRender3D ? t.skills.threeDUnavailable : undefined}
                      onClick={() => setViewMode('3d')}
                  >3D</button>
              </div>
              {webGLSupported !== null && !canRender3D && <p className="mt-3 text-sm theme-muted">{t.skills.threeDUnavailable}</p>}
          </motion.div>

          <motion.div
              ref={trackRef}
              className="relative w-full h-[360px] sm:h-[480px] lg:h-[650px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-600"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                  background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
                  boxShadow:
                      "0 0 60px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5)",
              }}
          >
              {showTrack ? <ErrorBoundary
                  fallback={<SkillsTrack2D sectors={sectors} onSelect={handleSectorClick} />}
                  onError={handleRendererFailure}
              >
                  <SkillsTrack3D
                      isPaused={isPaused || reducedMotion}
                      selectedSector={selectedSector}
                      onSectorClick={handleSectorClick}
                      sectors={sectors}
                      lowPower={lowPower}
                      sceneActive={sceneActive}
                      reducedMotion={reducedMotion}
                      onContextLost={handleRendererFailure}
                  />
              </ErrorBoundary> : webGLSupported === null && viewMode !== '2d'
                  ? <SkillsTrackLoading />
                  : <SkillsTrack2D sectors={sectors} onSelect={handleSectorClick} />}

          </motion.div>

          {/* Sector Details Modal - Enhanced UI/UX */}
          {typeof document !== 'undefined' && createPortal(<AnimatePresence mode="wait">
              {selectedSector && (
                  <motion.div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleClose}
                  >
                      {/* Animated background with blur */}
                      <motion.div
                          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                          initial={{ backdropFilter: "blur(0px)" }}
                          animate={{ backdropFilter: "blur(12px)" }}
                          exit={{ backdropFilter: "blur(0px)" }}
                      />

                      {/* Glow effect */}
                      <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{
                              background: `radial-gradient(circle at center, ${selectedSector.color}40 0%, transparent 70%)`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0.3 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.5 }}
                      />

                      <motion.div
                          id="skill-details"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby="skill-dialog-title"
                          className="relative max-w-3xl w-full max-h-[calc(100dvh-2rem)] rounded-3xl overflow-y-auto overscroll-contain shadow-2xl"
                          style={{
                              background:
                                  "var(--surface)",
                              border: `2px solid ${selectedSector.color}`,
                              boxShadow: `0 0 80px ${selectedSector.color}60, inset 0 0 80px rgba(0,0,0,0.3)`,
                          }}
                          initial={{
                              opacity: 0,
                              scale: 0.8,
                              rotateX: -15,
                              y: 50,
                          }}
                          animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: -50 }}
                          transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                          }}
                          onClick={(e) => e.stopPropagation()}
                      >
                          {/* Header with gradient background */}
                          <div
                              className="relative p-5 sm:p-8 overflow-hidden"
                              style={{
                                  background: `linear-gradient(135deg, ${selectedSector.color}20 0%, transparent 100%)`,
                              }}
                          >
                              {/* Animated particles in header */}
                              <div className="absolute inset-0 opacity-20">
                                  {[...Array(20)].map((_, i) => (
                                      <motion.div
                                          key={i}
                                          className="absolute w-1 h-1 rounded-full"
                                          style={{
                                              backgroundColor:
                                                  selectedSector.color,
                                              left: `${Math.random() * 100}%`,
                                              top: `${Math.random() * 100}%`,
                                          }}
                                          animate={{
                                              y: [0, -20, 0],
                                              opacity: [0, 1, 0],
                                          }}
                                          transition={{
                                              duration: 2 + Math.random() * 2,
                                              repeat: Infinity,
                                              delay: Math.random() * 2,
                                          }}
                                      />
                                  ))}
                              </div>

                              <button
                                  onClick={handleClose}
                                  aria-label="Close skill details"
                                  className="absolute top-4 right-4 z-20 min-h-11 min-w-11 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm transition-all hover:scale-110 hover:rotate-90 duration-300 group"
                              >
                                  <X className="w-5 h-5 text-slate-300 group-hover:text-white" />
                              </button>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative z-10">
                                  <motion.div
                                      className="w-20 h-20 flex-shrink-0 rounded-2xl flex items-center justify-center relative"
                                      style={{
                                          backgroundColor: `${selectedSector.color}20`,
                                          boxShadow: `0 0 30px ${selectedSector.color}40`,
                                      }}
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{
                                          type: "spring",
                                          delay: 0.2,
                                      }}
                                  >
                                      <div
                                          className="absolute inset-0 rounded-2xl"
                                          style={{
                                              background: `linear-gradient(135deg, ${selectedSector.color}40, transparent)`,
                                          }}
                                      />
                                      <div
                                          style={{
                                              color: selectedSector.color,
                                          }}
                                      >
                                          {React.createElement(
                                              selectedSector.icon,
                                              {
                                                  className:
                                                      "w-12 h-12 relative z-10",
                                              }
                                          )}
                                      </div>
                                  </motion.div>

                                  <div className="flex-1">
                                      <motion.h3
                                          id="skill-dialog-title"
                                          className="text-2xl sm:text-4xl break-words font-black text-slate-900 dark:text-white mb-2 tracking-tight"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.3 }}
                                      >
                                          {selectedSector.name}
                                      </motion.h3>
                                      <motion.p
                                          className="theme-muted text-base font-medium"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: 0.4 }}
                                      >
                                          {selectedSector.description}
                                      </motion.p>
                                  </div>
                              </div>
                          </div>

                          {/* Skills section with cards */}
                          <div className="p-5 sm:p-8 pt-6">
                              <motion.h4
                                  className="text-sm font-bold theme-muted uppercase tracking-wider mb-4 flex items-center gap-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                              >
                                  <div
                                      className="w-8 h-0.5 rounded-full"
                                      style={{
                                          backgroundColor: selectedSector.color,
                                      }}
                                  />
                                  {t.common.coreTechnologies}
                              </motion.h4>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {selectedSector.skills.map((skill, idx) => (
                                      <motion.div
                                          key={skill.name}
                                          className="group relative p-4 rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                                          style={{
                                              backgroundColor:
                                                  "var(--surface-muted)",
                                              border: "1px solid var(--border)",
                                          }}
                                          initial={{
                                              opacity: 0,
                                              y: 20,
                                              scale: 0.9,
                                          }}
                                          animate={{
                                              opacity: 1,
                                              y: 0,
                                              scale: 1,
                                          }}
                                          transition={{
                                              delay: 0.6 + idx * 0.08,
                                              type: "spring",
                                              stiffness: 200,
                                              damping: 20,
                                          }}
                                          whileHover={{
                                              scale: 1.05,
                                              backgroundColor: `${selectedSector.color}15`,
                                              borderColor: selectedSector.color,
                                              transition: { duration: 0.2 },
                                          }}
                                      >
                                          {/* Glow on hover */}
                                          <div
                                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                              style={{
                                                  boxShadow: `inset 0 0 20px ${selectedSector.color}30`,
                                              }}
                                          />

                                          <div className="relative z-10 flex items-center gap-3">
                                              {/* Skill Icon */}
                                              <motion.div
                                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700/50 p-2 relative"
                                                  whileHover={{
                                                      scale: 1.1,
                                                      rotate: 5,
                                                  }}
                                                  transition={{
                                                      type: "spring",
                                                      stiffness: 400,
                                                      damping: 10,
                                                  }}
                                              >
                                                  <SkillIcon
                                                      skill={skill}
                                                      size={40}
                                                  />
                                              </motion.div>

                                              {/* Skill Name */}
                                              <div className="flex-1">
                                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-white transition-colors block">
                                                      {skill.name}
                                                  </span>
                                              </div>

                                              {/* Glow Indicator */}
                                              <motion.div
                                                  className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 flex-shrink-0"
                                                  style={{
                                                      backgroundColor:
                                                          selectedSector.color,
                                                  }}
                                                  whileHover={{ scale: 1.5 }}
                                              />
                                          </div>

                                          {/* Animated border on hover */}
                                          <motion.div
                                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                                              style={{
                                                  border: `1px solid ${selectedSector.color}`,
                                              }}
                                              initial={false}
                                          />
                                      </motion.div>
                                  ))}
                              </div>
                          </div>

                          {/* Footer */}
                          <motion.div
                              className="px-5 sm:px-8 pb-6 flex items-center justify-between"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                          >
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                                  {t.common.pressEscToResume}
                              </p>
                          </motion.div>
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>, document.body)}

          {/* Sector Grid */}
          <motion.div
              className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
          >
              {sectors.map((sector, idx) => (
                  <motion.button
                      key={sector.id}
                      className="relative overflow-hidden p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 group"
                      style={{
                          boxShadow: `0 0 20px ${sector.color}20`,
                      }}
                      onClick={() => handleSectorClick(sector)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  >
                      {/* Gradient overlay */}
                      <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                          style={{
                              background: `linear-gradient(135deg, ${sector.color} 0%, transparent 100%)`,
                          }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-center gap-3 mb-3">
                              <div
                                  className="w-2 h-8 rounded-full flex-shrink-0 shadow-lg"
                                  style={{
                                      backgroundColor: sector.color,
                                      boxShadow: `0 0 10px ${sector.color}`,
                                  }}
                              />
                              <div className="flex-1 text-left">
                                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-white transition-colors">
                                      {sector.name}
                                  </h4>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                      {sector.skills.length}{" "}
                                      {t.common.technologies}
                                  </p>
                              </div>
                          </div>

                          {/* Skill Icons Preview */}
                          <div className="flex items-center gap-2 flex-wrap">
                              {sector.skills
                                  .slice(0, 5)
                                  .map((skill, skillIdx) => (
                                      <motion.div
                                          key={skill.name}
                                          className="w-8 h-8 rounded-lg bg-slate-700/50 p-1.5 relative flex items-center justify-center"
                                          initial={{ opacity: 0, scale: 0 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                              delay:
                                                  0.6 +
                                                  idx * 0.05 +
                                                  skillIdx * 0.03,
                                          }}
                                          whileHover={{
                                              scale: 1.2,
                                              zIndex: 10,
                                          }}
                                      >
                                          <SkillIcon skill={skill} size={32} />
                                      </motion.div>
                                  ))}
                              {sector.skills.length > 5 && (
                                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs text-slate-400 font-bold">
                                      +{sector.skills.length - 5}
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Border glow on hover */}
                      <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                          style={{
                              boxShadow: `inset 0 0 20px ${sector.color}30`,
                          }}
                      />
                  </motion.button>
              ))}
          </motion.div>

          {/* Styles */}

      </section>
  );
}
