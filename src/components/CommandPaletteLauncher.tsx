'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

const CommandPalette = dynamic(() => import('./CommandPalette'), { ssr: false });

export default function CommandPaletteLauncher({ navigate }: { navigate: (page: string) => void }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shortcut, setShortcut] = useState('Ctrl K');

  useEffect(() => {
    setShortcut(navigator.platform.toLowerCase().includes('mac') ? '⌘ K' : 'Ctrl K');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setLoaded(true);
        setOpen(value => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return <>
    <button
      aria-label="Open command palette"
      onClick={() => { setLoaded(true); setOpen(true); }}
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 px-4 py-2 bg-slate-900/90 dark:bg-slate-800/90 text-white rounded-lg shadow-lg backdrop-blur-xl border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors min-h-11 min-w-11 flex items-center justify-center gap-2"
    >
      <Terminal className="w-4 h-4" />
      <span className="hidden sm:inline text-sm font-mono">DevOps Console</span>
      <kbd className="hidden sm:inline px-2 py-0.5 text-xs bg-slate-700 rounded border border-slate-600">{shortcut}</kbd>
    </button>
    {loaded && <CommandPalette navigate={navigate} open={open} onOpenChange={setOpen} />}
  </>;
}
