'use client';

import React, { useEffect } from 'react';
import { usePosterStore } from '@/store/posterStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = usePosterStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}