'use client';

import { useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Briefcase,
  Mail,
  Terminal,
  Github,
  Linkedin,
  FileText,
  Activity,
  Zap,
} from 'lucide-react';

interface CommandPaletteProps {
  navigate: (page: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ navigate, open, onOpenChange }: CommandPaletteProps) {
  const handleCommand = useCallback((command: string) => {
    onOpenChange(false);
    
    const commands: { [key: string]: () => void } = {
      'home': () => navigate('home'),
      'skills': () => navigate('skills'),
      'skills-track': () => navigate('skills'),
      'racetrack': () => navigate('skills'),
      'f1': () => navigate('skills'),
      'projects': () => navigate('projects'),
      'contact': () => navigate('contact'),
      'github': () => window.open('https://github.com/iamtlcs', '_blank'),
      'linkedin': () => window.open('https://linkedin.com/in/iamtlcs', '_blank'),
      'logs': () => {
        console.table(performance.getEntriesByType('navigation').map(entry => entry.toJSON()));
        alert('Browser navigation timings printed to console (F12)');
      },
      'status': () => {
        void fetch('/api/status').then(response => {
          if (!response.ok) throw new Error('Status unavailable');
          return response.json();
        }).then(status => {
          console.table(status);
          alert('System status printed to console (F12)');
        }).catch(() => alert('Status is currently unavailable.'));
      },
    };

    if (commands[command]) {
      commands[command]();
    }
  }, [navigate, onOpenChange]);

  return (
    <>
      {/* Command Palette Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center px-3 pt-[8dvh] sm:pt-[15dvh] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          >
            <motion.div
              className="w-full min-w-0 max-w-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-slate-700 px-4">
                  <Terminal className="w-5 h-5 text-blue-400 mr-3" />
                  <Command.Input
                    autoFocus
                    aria-label="Search commands"
                    placeholder="Type a command or search... (e.g., 'goto projects', 'show navigation-timings')"
                    className="w-full py-4 text-slate-900 dark:text-slate-100 bg-transparent outline-none placeholder-slate-500 font-mono"
                  />
                </div>
                
                <Command.List className="max-h-[55dvh] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-slate-600 dark:text-slate-400 text-sm font-mono">
                    No results found. Try &apos;help&apos; for available commands.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-slate-400 text-xs font-mono px-2 py-2">
                    <CommandItem icon={Home} onSelect={() => handleCommand('home')}>
                      goto home
                    </CommandItem>
                    <CommandItem icon={Terminal} onSelect={() => handleCommand('skills')}>
                      goto skills-track (F1 🏎️)
                    </CommandItem>
                    <CommandItem icon={Briefcase} onSelect={() => handleCommand('projects')}>
                      goto projects
                    </CommandItem>
                    <CommandItem icon={Mail} onSelect={() => handleCommand('contact')}>
                      deploy contact-form
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading="System" className="text-slate-400 text-xs font-mono px-2 py-2 mt-2">
                    <CommandItem icon={FileText} onSelect={() => handleCommand('logs')}>
                      show navigation-timings
                    </CommandItem>
                    <CommandItem icon={Activity} onSelect={() => handleCommand('status')}>
                      systemctl status
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading="Links" className="text-slate-400 text-xs font-mono px-2 py-2 mt-2">
                    <CommandItem icon={Github} onSelect={() => handleCommand('github')}>
                      open github
                    </CommandItem>
                    <CommandItem icon={Linkedin} onSelect={() => handleCommand('linkedin')}>
                      open linkedin
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading="Info" className="text-slate-400 text-xs font-mono px-2 py-2 mt-2">
                    <div className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      💡 Pro tip: Use arrow keys to navigate, Enter to execute
                    </div>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface CommandItemProps {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onSelect: () => void;
}

function CommandItem({ icon: Icon, children, onSelect }: CommandItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-colors duration-150 font-mono text-sm group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 text-yellow-400" />
    </Command.Item>
  );
}

