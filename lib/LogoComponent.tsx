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
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded square */}
      <rect width="240" height="240" rx="52" fill="#16a34a"/>

      {/* Tab 3 (back-left) */}
      <rect x="44" y="68" width="56" height="26" rx="10" fill="#14532d"/>

      {/* Tab 2 (middle) */}
      <rect x="92" y="76" width="56" height="26" rx="10" fill="#15803d"/>

      {/* Tab 1 (front-right, active) */}
      <rect x="140" y="58" width="56" height="36" rx="10" fill="#22c55e"/>

      {/* Main sheet body */}
      <rect x="44" y="94" width="152" height="90" rx="14" fill="#fff" opacity="0.97"/>

      {/* Sheet grid lines - horizontal */}
      <line x1="44" y1="118" x2="196" y2="118" stroke="#16a34a" strokeWidth="1.2" opacity="0.2"/>
      <line x1="44" y1="140" x2="196" y2="140" stroke="#16a34a" strokeWidth="1.2" opacity="0.2"/>
      <line x1="44" y1="162" x2="196" y2="162" stroke="#16a34a" strokeWidth="1.2" opacity="0.2"/>

      {/* Sheet grid lines - vertical */}
      <line x1="104" y1="94" x2="104" y2="184" stroke="#16a34a" strokeWidth="1.2" opacity="0.2"/>
      <line x1="152" y1="94" x2="152" y2="184" stroke="#16a34a" strokeWidth="1.2" opacity="0.2"/>

      {/* Header row fill */}
      <rect x="44" y="94" width="152" height="24" fill="#16a34a" opacity="0.12"/>
    </svg>
  );
}
