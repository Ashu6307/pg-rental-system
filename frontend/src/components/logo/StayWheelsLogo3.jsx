import React from 'react';

const StayWheelsLogo3 = () => (
  <svg width="120" height="60" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Minimalist House + Wheel */}
    <polygon points="80,100 120,40 160,100" stroke="#2563eb" strokeWidth="8" fill="none"/>
    <circle cx="120" cy="100" r="22" stroke="#f59e42" strokeWidth="8" fill="#fff"/>
    {/* Spokes */}
    <line x1="120" y1="100" x2="120" y2="78" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="142" y2="100" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="98" y2="100" stroke="#f59e42" strokeWidth="4"/>
    {/* Window */}
    <rect x="112" y="60" width="16" height="12" rx="2" fill="#dbeafe"/>
    {/* Text */}
    <text x="90" y="30" fontFamily="Montserrat, Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="140" y="30" fontFamily="Montserrat, Arial, sans-serif" fontSize="22" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
  </svg>
);

export default StayWheelsLogo3;
