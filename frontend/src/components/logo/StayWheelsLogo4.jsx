import React from 'react';

const StayWheelsLogo4 = () => (
  <svg width="120" height="60" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Circular House + Wheel */}
    <ellipse cx="120" cy="70" rx="50" ry="30" stroke="#2563eb" strokeWidth="8" fill="none"/>
    <circle cx="120" cy="100" r="20" stroke="#f59e42" strokeWidth="8" fill="#fff"/>
    {/* Spokes */}
    <line x1="120" y1="100" x2="120" y2="80" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="140" y2="100" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="100" y2="100" stroke="#f59e42" strokeWidth="4"/>
    {/* Window */}
    <rect x="112" y="60" width="16" height="10" rx="2" fill="#dbeafe"/>
    {/* Text */}
    <text x="100" y="30" fontFamily="Montserrat, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="140" y="30" fontFamily="Montserrat, Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
  </svg>
);

export default StayWheelsLogo4;
