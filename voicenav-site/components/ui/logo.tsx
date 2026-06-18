import React from "react";

export function AzuoLogo({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="leftGrad" x1="20" y1="90" x2="50" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A0FF" />
          <stop offset="100%" stopColor="#0050FF" />
        </linearGradient>
        <linearGradient id="rightGrad" x1="50" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0050FF" />
          <stop offset="100%" stopColor="#9600FF" />
        </linearGradient>
      </defs>
      {/* Right Leg */}
      <path d="M50 15 L80 85" stroke="url(#rightGrad)" strokeWidth="20" strokeLinecap="round" />
      {/* Left Leg */}
      <path d="M50 15 L20 85" stroke="url(#leftGrad)" strokeWidth="20" strokeLinecap="round" />
    </svg>
  );
}
