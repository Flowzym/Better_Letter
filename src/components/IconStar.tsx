import React from 'react';

interface IconStarProps {
  filled?: boolean;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
}

export default function IconStar({
  filled = false,
  size = 16,
  stroke = '#F29400',
  strokeWidth = 2,
}: IconStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#FDE047' : 'none'}
      stroke={filled ? 'none' : stroke}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" />
    </svg>
  );
}
