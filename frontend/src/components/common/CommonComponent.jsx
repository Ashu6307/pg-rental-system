import React from 'react';

const CommonComponent = ({ children }) => {
  return (
    <div style={{ padding: '24px', background: '#f1f5f9', minHeight: '100vh' }}>
      {/* Common layout, header, or card can be added here */}
      {children}
    </div>
  );
};

export default CommonComponent;
