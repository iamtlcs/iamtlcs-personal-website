'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastFrame = 0;
    let width = 0;
    let height = 0;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; opacity: number }[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(width < 768 ? 24 : 70, Math.floor(width * height / 24000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.5 + 0.2,
      }));
    };
    const animate = (time: number) => {
      // Decorative animation needs only 30fps. Bound movement after a suspended tab.
      if (time - lastFrame >= 1000 / 30) {
        const step = Math.min((time - lastFrame) / (1000 / 60), 2);
        lastFrame = time;
        ctx.clearRect(0, 0, width, height);
        for (const particle of particles) {
          particle.x += particle.vx * step;
          particle.y += particle.vy * step;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${particle.opacity})`;
          ctx.fill();
        }
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSquared = dx * dx + dy * dy;
            if (distanceSquared < 22500) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(147, 197, 253, ${0.15 * (1 - Math.sqrt(distanceSquared) / 150)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      frame = requestAnimationFrame(animate);
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      if (reducedMotion.matches || document.hidden) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    };
    resize();
    updatePlayback();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', updatePlayback);
    reducedMotion.addEventListener('change', updatePlayback);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', updatePlayback);
      reducedMotion.removeEventListener('change', updatePlayback);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30" style={{ mixBlendMode: 'screen' }} />;
}
