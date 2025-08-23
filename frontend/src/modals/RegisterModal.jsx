import React, { useState } from 'react';

const RegisterModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Register As</h2>
        <div className="flex flex-col space-y-4">
          <button onClick={() => setRole('user')} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">User Register</button>
          <button onClick={() => setRole('owner')} className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Owner Register</button>
        </div>
        <button onClick={onClose} className="mt-6 text-gray-600 hover:text-gray-900">Close</button>
      </div>
    </div>
  );
};

export default RegisterModal;
