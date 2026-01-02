'use client';

import React, { useEffect, useState } from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Moon, Sun, Monitor, Trash2 } from 'lucide-react';

export function Settings() {
    const { setView } = usePosterStore();
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    useEffect(() => {
        const stored = localStorage.getItem('theme') as any;
        if (stored) setTheme(stored);
    }, []);

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        const root = document.documentElement;
        if (newTheme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', newTheme);
        }
    };

    return (
        <div className="p-8 w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8">Settings</h2>

            <div className="space-y-8">
                {/* Theme Section */}
                <section className="space-y-4 pb-8 border-b border-[var(--sidebar-border)]">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">Appearance</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all w-32 ${theme === 'light' ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--sidebar-bg)] text-[var(--muted-foreground)]'}`}
                        >
                            <Sun size={24} />
                            <span className="text-xs font-medium">Light</span>
                        </button>
                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all w-32 ${theme === 'dark' ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--sidebar-bg)] text-[var(--muted-foreground)]'}`}
                        >
                            <Moon size={24} />
                            <span className="text-xs font-medium">Dark</span>
                        </button>
                        <button
                            onClick={() => handleThemeChange('system')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all w-32 ${theme === 'system' ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--card-border)] bg-[var(--card)] hover:bg-[var(--sidebar-bg)] text-[var(--muted-foreground)]'}`}
                        >
                            <Monitor size={24} />
                            <span className="text-xs font-medium">System</span>
                        </button>
                    </div>
                </section>

                {/* Data Section */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">Data Management</h3>
                    <div className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-[var(--foreground)]">Reset Application</h4>
                            <p className="text-sm text-[var(--muted)]">Clear all local data and saved posters.</p>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure? This will delete all your posters.')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="text-red-500 hover:bg-red-500/10 px-4 py-2 rounded transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Reset Data
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
