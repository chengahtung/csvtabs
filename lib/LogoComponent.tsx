import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const dimensions = {
    sm: { width: 20, height: 20 },
    md: { width: 28, height: 28 },
    lg: { width: 36, height: 36 },
  };

  const dim = dimensions[size];

  return (
    <svg
      width={dim.width}
      height={dim.height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" stroke="#157e2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" stroke="#157e2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect width="8" height="8" x="14" y="14" rx="2" fill="none" stroke="#157e2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
