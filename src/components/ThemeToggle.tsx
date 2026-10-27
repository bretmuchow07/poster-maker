'use client';

import React, { useEffect, useState } from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className = '', size = 16 }: ThemeToggleProps) {
  const { theme, setTheme } = usePosterStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const isDark = mounted ? theme === 'dark' : true;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`tbtn border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] transition-all cursor-pointer ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun size={size} className="text-[var(--accent)] hover:rotate-12 transition-transform" />
      ) : (
        <Moon size={size} className="text-[var(--accent)] hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
