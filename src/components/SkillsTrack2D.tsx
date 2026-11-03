'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { Sector } from '@/lib/skills';

function pointAt(position: number) {
  const angle = position * Math.PI * 2;
  const sin = Math.sin(angle);
  const denominator = 1 + sin * sin;
  return {
    x: 300 + 230 * Math.cos(angle) / denominator,
    y: 180 + 360 * sin * Math.cos(angle) / denominator,
  };
}

const trackPath = Array.from({ length: 161 }, (_, index) => {
  const { x, y } = pointAt(index / 160);
  return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
}).join(' ') + ' Z';

export default function SkillsTrack2D({ sectors, onSelect }: {
  sectors: Sector[];
  onSelect: (sector: Sector) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex h-full items-center bg-slate-50 dark:bg-slate-900 p-3 sm:p-6" data-testid="skills-track-2d">
      <div className="relative mx-auto aspect-[5/3] w-full max-w-4xl" role="group" aria-label={t.skills.twoDTrackLabel}>
        <svg viewBox="0 0 600 360" className="h-full w-full" aria-hidden="true">
          <path d={trackPath} fill="none" stroke="#64748b" strokeWidth="64" strokeLinejoin="round" />
          <path d={trackPath} fill="none" stroke="#1e293b" strokeWidth="52" strokeLinejoin="round" />
          <path d={trackPath} fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="8 10" />
          <g transform="translate(530 180)">
            <rect x="-12" y="-7" width="24" height="14" rx="4" fill="#dc2626" />
            <rect x="-3" y="-5" width="8" height="10" rx="2" fill="#dbeafe" />
          </g>
        </svg>
        {sectors.map((sector, index) => {
          const { x, y } = pointAt(sector.position);
          const Icon = sector.icon;
          return (
            <button
              key={sector.id}
              type="button"
              className="theme-control absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 shadow-md hover:scale-110 focus-visible:z-10"
              style={{ left: `${x / 6}%`, top: `${y / 3.6}%`, borderColor: sector.color }}
              aria-label={`${index + 1}. ${sector.name}`}
              aria-haspopup="dialog"
              aria-controls="skill-details"
              title={sector.name}
              onClick={() => onSelect(sector)}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900" aria-hidden="true">{index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
