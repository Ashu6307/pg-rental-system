import React, { useState } from 'react';
import StayWheelsLogo1 from './StayWheelsLogo1';
import StayWheelsLogo2 from './StayWheelsLogo2';
import StayWheelsLogo3 from './StayWheelsLogo3';

const logoOptions = [
  { id: 1, component: <StayWheelsLogo1 />, name: 'Classic Arch' },
  { id: 2, component: <StayWheelsLogo2 />, name: 'Modern Flat' },
  { id: 3, component: <StayWheelsLogo3 />, name: 'Minimal Curve' },
];

const LogoSelector = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Choose Your Logo</h2>
      <div style={{ display: 'flex', gap: 32 }}>
        {logoOptions.map((logo) => (
          <div
            key={logo.id}
            style={{
              border: selected === logo.id ? '3px solid #2563eb' : '2px solid #e5e7eb',
              borderRadius: 12,
              padding: 12,
              cursor: 'pointer',
              background: selected === logo.id ? '#f1f5f9' : '#fff',
              transition: 'all 0.2s',
              boxShadow: selected === logo.id ? '0 4px 16px #2563eb22' : '0 2px 8px #0001',
            }}
            onClick={() => { setSelected(logo.id); onSelect && onSelect(logo.id); }}
          >
            {logo.component}
            <div style={{ textAlign: 'center', marginTop: 8, fontWeight: 600 }}>{logo.name}</div>
          </div>
        ))}
      </div>
      {selected && <div style={{ marginTop: 24, color: '#2563eb', fontWeight: 600 }}>Selected: {logoOptions.find(l => l.id === selected).name}</div>}
    </div>
  );
};

export default LogoSelector;
