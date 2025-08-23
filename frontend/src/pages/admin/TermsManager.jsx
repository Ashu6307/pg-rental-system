import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerms, updateTerms } from '../../redux/termsSlice';

const TermsManager = () => {
  const dispatch = useDispatch();
  const terms = useSelector((state) => state.terms.content);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchTerms());
  }, [dispatch]);

  useEffect(() => {
    setContent(terms);
  }, [terms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTerms(content)).unwrap();
      setMessage('Terms updated successfully!');
    } catch {
      setMessage('Error updating terms.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Terms & Conditions Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block font-semibold mb-1">Terms & Conditions</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded px-3 py-2" rows={8} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update</button>
      </form>
      {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
    </div>
  );
};

export default TermsManager;
