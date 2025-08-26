import React, { useEffect, useState } from 'react';
import { FaFileContract, FaCheckCircle } from 'react-icons/fa';

const TermsPopup = ({ isOpen, onAccept, onClose, type }) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const accentColor = type === 'owner_registration' ? 'green' : type === 'admin_registration' ? 'red' : 'blue';

  // Role wise popup background color
  const popupBg = accentColor === 'green' ? 'bg-green-50' : accentColor === 'red' ? 'bg-red-50' : 'bg-blue-50';

  useEffect(() => {
    if (isOpen && type) {
      setLoading(true);
      setError('');
      fetch(`/api/terms/${type}`)
        .then(res => res.json())
        .then(data => {
          if (data.content) setContent(data.content);
          else setError('No Terms & Conditions found.');
        })
        .catch(() => setError('Failed to load Terms & Conditions.'))
        .finally(() => setLoading(false));
    }
    if (isOpen) {
      setAccepted(false);
      setShowSuccess(false);
    }
  }, [isOpen, type]);

  const handleAccept = () => {
    setAccepted(true);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onAccept();
    }, 700);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`relative ${popupBg} bg-white/80 border border-${accentColor}-200 rounded-2xl shadow-2xl max-w-2xl w-full p-8 flex flex-col items-center animate-fade-in`} style={{backdropFilter: 'blur(8px)'}}>
        <div className={`flex flex-col items-center mb-4`}>
          <FaFileContract className={`text-${accentColor}-500 text-5xl drop-shadow-lg mb-2`} />
          <h2 className={`text-2xl font-bold text-${accentColor}-700`}>Terms & Conditions</h2>
        </div>
        <div className="overflow-y-auto max-h-96 text-gray-700 mb-6 whitespace-pre-line w-full px-2">
          {loading ? 'Loading...' : error ? error : content}
        </div>
        {showSuccess ? (
          <div className="flex flex-col items-center mb-4">
            <FaCheckCircle className={`text-${accentColor}-500 text-4xl animate-bounce mb-2`} />
            <div className={`text-${accentColor}-600 font-semibold text-center`}>Accepted!</div>
          </div>
        ) : (
          <button
            className={`bg-${accentColor}-600 text-white px-6 py-2 rounded-full shadow font-semibold w-full hover:bg-${accentColor}-700 transition-all duration-150`}
            onClick={handleAccept}
            disabled={loading}
          >
            Accept
          </button>
        )}
        <button
          className={`absolute top-2 right-2 text-gray-400 hover:text-${accentColor}-600 text-2xl transition-all duration-150`}
          onClick={accepted ? onClose : undefined}
          aria-label="Close"
          disabled={!accepted}
          style={{cursor: accepted ? 'pointer' : 'not-allowed', opacity: accepted ? 1 : 0.4}}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TermsPopup;
