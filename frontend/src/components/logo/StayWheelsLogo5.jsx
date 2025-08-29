import React from 'react';

const StayWheelsLogo5 = () => (
  <svg width="120" height="60" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Modern Arch + Wheel */}
    <path d="M60 100 Q60 60 120 60 Q180 60 180 100" stroke="#2563eb" strokeWidth="8" fill="none"/>
    <circle cx="120" cy="100" r="18" stroke="#f59e42" strokeWidth="8" fill="#fff"/>
    {/* Spokes */}
    <line x1="120" y1="100" x2="120" y2="82" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="138" y2="100" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="102" y2="100" stroke="#f59e42" strokeWidth="4"/>
    {/* Window */}
    <rect x="112" y="70" width="16" height="10" rx="2" fill="#dbeafe"/>
    {/* Text */}
    <text x="110" y="50" fontFamily="Montserrat, Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="140" y="50" fontFamily="Montserrat, Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
  </svg>
);

export default StayWheelsLogo5;
