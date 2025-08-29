import React from 'react';

const StayWheelsLogo = () => {
  return (
    <svg
      width="200"
      height="100"
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House Outline */}
      <path
        d="M100 120 L100 60 L150 30 L200 60 L200 120"
        stroke="#2563eb"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Window */}
      <rect x="135" y="60" width="30" height="30" rx="5" fill="#dbeafe" />
      {/* Wheel */}
      <circle cx="150" cy="140" r="30" stroke="#f59e42" strokeWidth="10" fill="none" />
      {/* Wheel Spokes */}
      <line x1="150" y1="110" x2="150" y2="170" stroke="#f59e42" strokeWidth="5"/>
      <line x1="120" y1="140" x2="180" y2="140" stroke="#f59e42" strokeWidth="5"/>
      <line x1="130" y1="120" x2="170" y2="160" stroke="#f59e42" strokeWidth="5"/>
      <line x1="130" y1="160" x2="170" y2="120" stroke="#f59e42" strokeWidth="5"/>
      {/* Text */}
      <text x="220" y="90" fontFamily="Arial, sans-serif" fontSize="40" fill="#111827">
        Stay
      </text>
      <text x="220" y="140" fontFamily="Arial, sans-serif" fontSize="40" fill="#f59e42" fontStyle="italic">
        Wheels
      </text>
      {/* Underline */}
      <line x1="220" y1="145" x2="380" y2="145" stroke="#2563eb" strokeWidth="5" />
    </svg>
  );
};

export default StayWheelsLogo;
