import React from 'react';

const StayWheelsLogoModern = () => (
  <svg width="220" height="90" viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Gradient */}
    <defs>
      <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#fff" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="440" height="180" rx="32" fill="url(#bgGradient)" />
    {/* House Outline */}
    <path d="M80 120 Q80 60 160 60 Q240 60 240 120" stroke="#2563eb" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Wheel (half) */}
    <path d="M120 120 A40 40 0 0 1 200 120" stroke="#f59e42" strokeWidth="12" fill="none"/>
    {/* Spokes */}
    <line x1="160" y1="120" x2="160" y2="80" stroke="#f59e42" strokeWidth="6" strokeLinecap="round"/>
    <line x1="160" y1="120" x2="190" y2="110" stroke="#f59e42" strokeWidth="6" strokeLinecap="round"/>
    <line x1="160" y1="120" x2="130" y2="110" stroke="#f59e42" strokeWidth="6" strokeLinecap="round"/>
    <line x1="160" y1="120" x2="180" y2="140" stroke="#f59e42" strokeWidth="6" strokeLinecap="round"/>
    {/* Window */}
    <rect x="145" y="75" width="30" height="22" rx="6" fill="#f1f5f9" />
    {/* Handlebar */}
    <rect x="240" y="90" width="28" height="8" rx="4" fill="#2563eb" transform="rotate(-20 240 90)"/>
    {/* Text */}
    <text x="260" y="110" fontFamily="Montserrat, Segoe UI, Arial, sans-serif" fontSize="54" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="260" y="160" fontFamily="Montserrat, Segoe UI, Arial, sans-serif" fontSize="54" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
    {/* Underline */}
    <rect x="260" y="168" width="170" height="8" rx="4" fill="#2563eb"/>
  </svg>
);

export default StayWheelsLogoModern;
