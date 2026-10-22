import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export function SentinelLogo({ size = 32, className = "" }: LogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Cybernetic Neon Cyan to Deep Electric Blue Gradient */}
          <linearGradient id="sentinelShield" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Core Accent Glow */}
          <linearGradient id="coreGlow" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Stylized X Energy Blades */}
          <linearGradient id="bladeGrad1" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="bladeGrad2" x1="34" y1="14" x2="14" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Holographic Glow Filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Cyber Shield Frame */}
        <path
          d="M24 3L41 10.5V23.5C41 33.8 33.8 42.6 24 45C14.2 42.6 7 33.8 7 23.5V10.5L24 3Z"
          fill="#071326"
          stroke="url(#sentinelShield)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
        />

        {/* Inner Tech Contour lines */}
        <path
          d="M24 7.5L37.5 13.5V23C37.5 31.4 31.8 38.6 24 40.8C16.2 38.6 10.5 31.4 10.5 23V13.5L24 7.5Z"
          stroke="#0284c7"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeDasharray="2 2"
        />

        {/* Dynamic Cyber "X" - Primary Diagonals */}
        <path
          d="M16 15L32 33"
          stroke="url(#bladeGrad1)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M32 15L16 33"
          stroke="url(#bladeGrad2)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Tech Nodes at Cross Points */}
        <circle cx="24" cy="24" r="3.2" fill="#00f5ff" />
        <circle cx="24" cy="24" r="1.4" fill="#ffffff" />

        {/* Corner Telemetry Pins */}
        <circle cx="16" cy="15" r="1.2" fill="#38bdf8" />
        <circle cx="32" cy="15" r="1.2" fill="#38bdf8" />
        <circle cx="16" cy="33" r="1.2" fill="#38bdf8" />
        <circle cx="32" cy="33" r="1.2" fill="#38bdf8" />

        {/* Top Antenna Beacon */}
        <circle cx="24" cy="3" r="1.4" fill="#00f5ff" />
      </svg>
    </div>
  );
}
export default SentinelLogo;
