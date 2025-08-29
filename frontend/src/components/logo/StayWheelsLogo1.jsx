
import React from 'react';

const StayWheelsLogo1 = () => (
  <svg width="180" height="90" viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="swl1-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#fff" />
      </linearGradient>
      <filter id="swl1-shadow" x="0" y="0" width="360" height="180" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2563eb22" />
      </filter>
    </defs>
    <rect x="0" y="0" width="360" height="180" rx="24" fill="url(#swl1-bg)" />
    {/* Arch House + Wheel */}
    <path d="M60 140 Q60 60 180 60 Q300 60 300 140" stroke="#2563eb" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#swl1-shadow)"/>
    <path d="M110 140 A70 70 0 0 1 250 140" stroke="#f59e42" strokeWidth="14" fill="none" filter="url(#swl1-shadow)"/>
    {/* Spokes */}
    <line x1="180" y1="140" x2="180" y2="80" stroke="#f59e42" strokeWidth="7" strokeLinecap="round"/>
    <line x1="180" y1="140" x2="230" y2="120" stroke="#f59e42" strokeWidth="7" strokeLinecap="round"/>
    <line x1="180" y1="140" x2="130" y2="120" stroke="#f59e42" strokeWidth="7" strokeLinecap="round"/>
    <line x1="180" y1="140" x2="210" y2="170" stroke="#f59e42" strokeWidth="7" strokeLinecap="round"/>
    {/* Window */}
    <rect x="160" y="85" width="40" height="28" rx="8" fill="#f1f5f9" />
    {/* Handlebar */}
    <rect x="300" y="100" width="32" height="10" rx="5" fill="#2563eb" transform="rotate(-20 300 100)"/>
    {/* Text */}
    <text x="220" y="110" fontFamily="Montserrat, Segoe UI, Arial, sans-serif" fontSize="38" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="220" y="160" fontFamily="Montserrat, Segoe UI, Arial, sans-serif" fontSize="38" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
    {/* Underline */}
    <rect x="220" y="168" width="110" height="7" rx="3.5" fill="#2563eb"/>
  </svg>
);

export default StayWheelsLogo1;
