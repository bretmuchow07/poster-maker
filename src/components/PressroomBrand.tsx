'use client';

import React, { useId } from 'react';

export function PressroomMark({ className = 'w-6 h-6' }: { className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-label="Pressroom Mark">
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" fill="white" />
          <circle cx="16" cy="16" r="3.6" fill="black" />
          <path d="M 10.3 12.1 A 6.9 6.9 0 0 1 16 9.1" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M 12.1 13.3 A 4.8 4.8 0 0 1 16 11.2" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
        </mask>
      </defs>
      <path
        d="M2.5 6.5 H29.5 M2.5 25.5 H29.5 M6.5 2.5 V29.5 M25.5 2.5 V29.5 M16 2.5 V6.5 M16 25.5 V29.5 M2.5 16 H6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
      <circle cx="16" cy="16" r="9.2" fill="currentColor" mask={`url(#${maskId})`} />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" />
      <rect x="19.2" y="14.6" width="10.8" height="2.8" fill="var(--accent)" />
    </svg>
  );
}

export function PressroomLockupHorizontal({ className = 'h-8 w-auto' }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 214 40"
      fill="none"
      className={className}
      role="img"
      aria-label="Pressroom — Music Print Studio"
    >
      <defs>
        <mask id={maskId}>
          <rect width="40" height="40" fill="white" />
          <circle cx="20" cy="20" r="4.5" fill="black" />
          <path d="M 12.9 15.1 A 8.6 8.6 0 0 1 20 11.4" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 15.1 16.6 A 6 6 0 0 1 20 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </mask>
      </defs>
      {/* Mark */}
      <path
        d="M3 8.5 H37 M3 31.5 H37 M8.5 3 V37 M31.5 3 V37 M20 3 V8.5 M20 31.5 V37 M3 20 H8.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="square"
      />
      <circle cx="20" cy="20" r="11.4" fill="currentColor" mask={`url(#${maskId})`} />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      <rect x="24" y="18.25" width="13.5" height="3.5" fill="var(--accent)" />

      {/* Wordmark & Descriptor */}
      <text
        x="48"
        y="21.5"
        fill="currentColor"
        fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
        fontSize="19"
        fontWeight="700"
        letterSpacing="1.8"
      >
        PRESSROOM
      </text>
      <text
        x="49"
        y="33.5"
        fill="currentColor"
        opacity="0.72"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8.2"
        fontWeight="600"
        letterSpacing="2.4"
      >
        MUSIC PRINT STUDIO
      </text>
    </svg>
  );
}

export function PressroomLockupStacked({ className = 'w-44 h-auto' }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 180 148"
      fill="none"
      className={className}
      role="img"
      aria-label="Pressroom — Music Print Studio"
    >
      <defs>
        <mask id={maskId}>
          <rect x="44" y="4" width="92" height="92" fill="white" />
          <circle cx="90" cy="50" r="10.4" fill="black" />
          <path d="M 73.5 38.8 A 19.8 19.8 0 0 1 90 30.2" stroke="black" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M 78.8 42.2 A 13.8 13.8 0 0 1 90 36.2" stroke="black" strokeWidth="3.2" strokeLinecap="round" />
        </mask>
      </defs>
      {/* Centered Mark */}
      <path
        d="M51 23 H129 M51 77 H129 M63 11 V89 M117 11 V89 M90 11 V23 M90 77 V89 M51 50 H63"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="square"
      />
      <circle cx="90" cy="50" r="26.5" fill="currentColor" mask={`url(#${maskId})`} />
      <circle cx="90" cy="50" r="3.4" fill="currentColor" />
      <rect x="99" y="46" width="31" height="8" fill="var(--accent)" />

      {/* Centered Wordmark & Descriptor */}
      <text
        x="90"
        y="119"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
        fontSize="22"
        fontWeight="700"
        letterSpacing="2.2"
      >
        PRESSROOM
      </text>
      <text
        x="90"
        y="137"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.72"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="9"
        fontWeight="600"
        letterSpacing="2.8"
      >
        MUSIC PRINT STUDIO
      </text>
    </svg>
  );
}
