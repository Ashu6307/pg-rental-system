import React from 'react';

const StayWheelsLogo2 = () => (
  <svg width="120" height="60" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flat House + Wheel */}
    <rect x="60" y="50" width="120" height="40" rx="10" stroke="#2563eb" strokeWidth="8" fill="none"/>
    <circle cx="120" cy="100" r="24" stroke="#f59e42" strokeWidth="8" fill="#fff"/>
    {/* Spokes */}
    <line x1="120" y1="100" x2="120" y2="76" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="144" y2="100" stroke="#f59e42" strokeWidth="4"/>
    <line x1="120" y1="100" x2="96" y2="100" stroke="#f59e42" strokeWidth="4"/>
    {/* Window */}
    <rect x="110" y="60" width="20" height="14" rx="3" fill="#dbeafe"/>
    {/* Text */}
    <text x="70" y="40" fontFamily="Montserrat, Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#1e293b">Stay</text>
    <text x="130" y="40" fontFamily="Montserrat, Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#f59e42" fontStyle="italic">Wheels</text>
  </svg>
);

export default StayWheelsLogo2;
