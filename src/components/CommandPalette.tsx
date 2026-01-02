'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Briefcase,
  MapPin,
  Heart,
  Mail,
  Terminal,
  Github,
  Linkedin,
  FileText,
  Activity,
  Server,
  Zap,
} from 'lucide-react';

interface CommandPaletteProps {
  navigate: (page: string) => void;
}

export default function CommandPalette({ navigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading logs
    const sampleLogs = [
      '[2024-12-29 10:23:45] ✅ Deployment successful - Build #7f3a21',
      '[2024-12-29 09:15:32] 🔄 Updating dependencies...',
      '[2024-12-29 08:42:18] 📊 Analytics: 147 visitors today',
      '[2024-12-29 07:30:05] 🔒 SSL certificate renewed',
      '[2024-12-29 06:12:44] ⚡ CDN cache cleared',
      '[2024-12-28 23:45:22] 🚀 Vercel Edge Network: OK',
      '[2024-12-28 22:10:15] 💾 Database backup completed',
      '[2024-12-28 20:33:08] 🔐 Security scan: No vulnerabilities',
    ];
    setLogs(sampleLogs);
  }, []);

  // Toggle command palette with Cmd+K / Ctrl+K
  useEffect(() => {
    if (!mounted) return;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [mounted]);

  const handleCommand = useCallback((command: string) => {
    setOpen(false);
    
    const commands: { [key: string]: () => void } = {
      'home': () => navigate('home'),
      'skills': () => navigate('skills'),
      'skills-track': () => navigate('skills'),
      'racetrack': () => navigate('skills'),
      'f1': () => navigate('skills'),
      'projects': () => navigate('projects'),
      'architecture': () => navigate('architecture'),
      'hongkong': () => navigate('hongkong'),
      'origin': () => navigate('hongkong'),
      'hobbies': () => navigate('hobbies'),
      'contact': () => navigate('contact'),
      'github': () => window.open('https://github.com/iamtlcs', '_blank'),
      'linkedin': () => window.open('https://linkedin.com/in/iamtlcs', '_blank'),
      'logs': () => {
        console.table(logs);
        alert('Server logs printed to console (F12)');
      },
      'status': () => {
        const status = {
          system: 'Operational 🟢',
          uptime: '99.99%',
          latency: `${Math.random() * 50 + 10 | 0}ms`,
          deployment: 'Vercel Edge Network',
          region: 'Hong Kong (ap-east-1)',
        };
        console.table(status);
        alert('System status printed to console (F12)');
      },
    };

    if (commands[command]) {
      commands[command]();
    }
  }, [navigate, logs]);

  if (!mounted) return null;

  return (
    <>
      {/* Keyboard Hint */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2 bg-slate-900/90 dark:bg-slate-800/90 text-white rounded-lg shadow-lg backdrop-blur-xl border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 flex items-center gap-2 group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Terminal className="w-4 h-4" />
        <span className="text-sm font-mono">DevOps Console</span>
        {/* Show ⌘K for Mac, Ctrl+K for Windows/Linux */}
        <kbd className="px-2 py-0.5 text-xs bg-slate-700 dark:bg-slate-600 rounded border border-slate-600 dark:border-slate-500">
          {typeof window !== "undefined" && navigator.platform.toLowerCase().indexOf('mac') >= 0 ? '⌘ K' : 'Ctrl K'}
        </kbd>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl mx-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="flex items-center border-b border-slate-700 px-4">
                  <Terminal className="w-5 h-5 text-blue-400 mr-3" />
                  <Command.Input
                    placeholder="Type a command or search... (e.g., 'goto projects', 'cat server-logs')"
                    className="w-full py-4 text-slate-100 bg-transparent outline-none placeholder-slate-500 font-mono"
                  />
                </div>
                
                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-slate-500 text-sm font-mono">
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
                    <CommandItem icon={Server} onSelect={() => handleCommand('architecture')}>
                      goto architecture
                    </CommandItem>
                    <CommandItem icon={MapPin} onSelect={() => handleCommand('hongkong')}>
                      goto origin
                    </CommandItem>
                    <CommandItem icon={Heart} onSelect={() => handleCommand('hobbies')}>
                      goto hobbies
                    </CommandItem>
                    <CommandItem icon={Mail} onSelect={() => handleCommand('contact')}>
                      deploy contact-form
                    </CommandItem>
                  </Command.Group>

                  <Command.Group heading="System" className="text-slate-400 text-xs font-mono px-2 py-2 mt-2">
                    <CommandItem icon={FileText} onSelect={() => handleCommand('logs')}>
                      cat server-logs
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
                    <div className="px-3 py-2 text-xs text-slate-500 font-mono">
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
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-blue-600 hover:text-white transition-colors duration-150 font-mono text-sm group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
      <span className="flex-1">{children}</span>
      <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 text-yellow-400" />
    </Command.Item>
  );
}

